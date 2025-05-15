import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import CalendarSkeleton from "@/components/CalendarSkeleton";
import axiosClient from "@/axios";
import AddEventModal from "@/components/AddEventModal";
import { motion } from "framer-motion";
import CalendarSettings from "@/components/CalendarSettings";
import { Edit, Trash2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EventDetailsModal from "@/components/EventDetailsModal";
import { useSelector } from "react-redux";
import { getAuthUser } from "@/redux/authSlice";

export default function Calendar() {
  const user = useSelector(getAuthUser);
  const { open } = useSidebar();
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem("calendar_settings")) || {
      showPassedEvents: false,
      showFutureEvents: true,
      showWeekendDays: true,
      showInvitedEvents: true, // Added this line
    }
  );
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedEventForModal, setSelectedEventForModal] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 768px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const fetchEvents = useCallback(async () => {
    setIsEventsLoading(true);
    try {
      const { data } = await axiosClient.get("events");
      setAllEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsEventsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axiosClient.get("eventCategories");
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, [fetchEvents, fetchCategories]);

  // Filter events based on settings
  useEffect(() => {
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const filtered = allEvents.filter((event) => {
      const eventDate = new Date(event.start_time).setHours(0, 0, 0, 0);
      const isPastEvent = eventDate < currentDate;
      const isInvitedEvent = event.user_id !== user.id;

      return (
        (settings.showPassedEvents || !isPastEvent) &&
        (settings.showFutureEvents || isPastEvent) &&
        (settings.showInvitedEvents || !isInvitedEvent)
      );
    });
    localStorage.setItem("calendar_settings", JSON.stringify(settings));
    setEvents(filtered);
  }, [settings, allEvents, user]);

  // Show skeleton on sidebar toggle
  useEffect(() => {
    setShowSkeleton(true);
    const timer = setTimeout(() => setShowSkeleton(false), 200);
    return () => clearTimeout(timer);
  }, [open]);

  const handleDateClick = useCallback((selected) => {
    setSelectedDate(selected);
    setSelectedEvent(null);
    setIsDialogOpen(true);
  }, []);

  const handleEditClick = useCallback((event) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsDialogOpen(true);
  }, []);

  const handleEventSubmit = useCallback(
    async (data) => {
      try {
        const eventData = {
          ...data,
          start_time: selectedEvent
            ? selectedEvent.start_time
            : format(selectedDate.start, "yyyy-MM-dd HH:mm:ss"),
          end_time: selectedEvent
            ? selectedEvent.end_time
            : format(selectedDate.end, "yyyy-MM-dd HH:mm:ss"),
        };

        let updatedEvent;

        if (selectedEvent) {
          const { data: response } = await axiosClient.put(
            `events/${selectedEvent.id}`,
            eventData
          );
          updatedEvent = response;
          toast.success("Event updated successfully");
        } else {
          const { data: newEvent } = await axiosClient.post(
            "events",
            eventData
          );

          updatedEvent = newEvent;
          const attendees = data.attendees;
          console.log(attendees);
          if (attendees.user_ids?.length > 0 || attendees.team_ids?.length) {
            const { data: eventWithAttendees } = await axiosClient.post(
              `events/${newEvent.id}/invite`,
              {
                ...attendees,
              }
            );
            updatedEvent = eventWithAttendees;
          }

          toast.success("Event created successfully");
        }

        setAllEvents((prev) =>
          selectedEvent
            ? prev.map((event) =>
                event.id === selectedEvent.id ? updatedEvent : event
              )
            : [updatedEvent, ...prev]
        );
      } catch (error) {
        console.error("Failed to save event:", error);
        toast.error(error.response?.data?.message || "Failed to save event");
      } finally {
        setSelectedEvent(null);
        setSelectedDate(null);
        setIsDialogOpen(false);
      }
    },
    [selectedEvent, selectedDate]
  );

  const handleEventClick = useCallback(
    ({ event }) => {
      const fullEvent = events.find((e) => e.id === parseInt(event.id));
      setSelectedEventForModal(fullEvent);
      setIsDetailsModalOpen(true);
    },
    [events]
  );

  const handleEditFromDetails = useCallback((event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(false);
    setIsDialogOpen(true);
  }, []);

  const handleDeleteFromDetails = useCallback((event) => {
    setConfirmDelete({ id: event.id, title: event.title });
    setIsDetailsModalOpen(false);
  }, []);

  const confirmDeleteEvent = useCallback(async () => {
    if (!confirmDelete) return;

    try {
      await axiosClient.delete(`events/${confirmDelete.id}`);
      setAllEvents((prev) =>
        prev.filter((event) => event.id !== confirmDelete.id)
      );
    } catch (error) {
      console.error("Failed to delete event:", error);
    } finally {
      setConfirmDelete(null);
    }
  }, [confirmDelete]);

  const updateDates = async (selected) => {
    const { event } = selected;
    const newStartTime = format(event.start, "yyyy-MM-dd HH:mm:ss");
    const newEndTime = format(event.end, "yyyy-MM-dd HH:mm:ss");

    try {
      const eventData = {
        start_time: newStartTime,
        end_time: newEndTime,
      };
      const { data } = await axiosClient.patch(`events/${event.id}`, eventData);

      const updatedEvent = {
        ...data,
        start_time: newStartTime,
        end_time: newEndTime,
      };

      setEvents(events.map((el) => (el.id == event.id ? updatedEvent : el)));
      console.log(events);
      setAllEvents(
        allEvents.map((el) => (el.id == event.id ? updatedEvent : el))
      );
    } catch (error) {
      console.error("Failed to update event date:", error);
      selected.revert();
    }
  };

  const handleEventUpdate = useCallback((updatedEvent) => {
    setAllEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  }, []);

  // Get calendar view based on screen size
  const getCalendarView = useMemo(() => {
    if (isMobile) return "listMonth";
    return "dayGridMonth";
  }, [isMobile]);

  // Get header toolbar configuration based on screen size
  const getHeaderToolbar = useMemo(() => {
    if (isMobile) {
      return {
        left: "prev,next",
        center: "title",
        right: "dayGridMonth,listMonth",
      };
    } else if (isTablet) {
      return {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,listMonth,timeGridDay",
      };
    } else {
      return {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
      };
    }
  }, [isMobile, isTablet]);

  // Format events for FullCalendar

  const renderEventList = () => {
    if (isEventsLoading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <li
          key={index}
          className="calendar-event-item opacity-50 w-full min-h-[100px] sm:min-h-[120px] p-3 border rounded-md"
        >
          <Skeleton className="h-5 w-3/4 mb-2" />
          <div className="flex items-center gap-2 mt-1">
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-4 w-1/2 mt-1" />
        </li>
      ));
    }

    if (events.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 p-6 border border-dashed rounded-md w-full">
          <CalendarIcon className="h-12 w-12 mb-2 text-gray-400" />
          <p className="text-base lg:text-lg font-medium">No Events Found</p>
          <p className="text-sm text-gray-400 mt-1">
            Click on the calendar to add a new event
          </p>
        </div>
      );
    }

    return events.map((event) => (
      <motion.li
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="calendar-event-item w-full min-h-[90px] p-3 border rounded-md hover:shadow-md transition-all duration-300"
        key={event.id}
      >
        <div className="flex justify-between items-start gap-2">
          <span className="text-sm md:text-base font-medium line-clamp-2">
            {event.title}
          </span>
          {event.user_id === user.id && (
            <div className="flex gap-2 shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleEditClick(event)}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50"
                      aria-label="Edit event"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit event</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() =>
                        setConfirmDelete({ id: event.id, title: event.title })
                      }
                      className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                      aria-label="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete event</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            {event.category?.name || "Uncategorized"}
          </Badge>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {format(new Date(event.start_time), "MMM d, yyyy")} -{" "}
          {format(new Date(event.end_time), "MMM d, yyyy")}
        </div>
      </motion.li>
    ));
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full p-3 sm:p-4 lg:p-6 gap-4 lg:gap-6">
        <div className="calendar-container w-full lg:w-3/12   rounded-lg shadow-sm mb-4 lg:mb-0 border">
          <div className="calendar-header justify-between flex items-center p-3 sm:p-4 border-b dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Events
            </h3>
            <CalendarSettings settings={settings} setSettings={setSettings} />
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-250px)] lg:max-h-[calc(100vh-200px)]">
            <ul className="flex flex-col gap-3 p-3 sm:p-4">
              {renderEventList()}
            </ul>
          </div>
        </div>

        <div className="w-full lg:w-9/12  rounded-lg shadow-sm border">
          {showSkeleton ? (
            <CalendarSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="calendar-wrapper rounded-lg overflow-hidden"
            >
              <FullCalendar
                eventResize={updateDates}
                firstDay={1}
                editable
                eventDurationEditable
                weekends={settings.showWeekendDays}
                height={isMobile ? "70vh" : isDesktop ? "85vh" : "75vh"}
                headerToolbar={getHeaderToolbar}
                views={{
                  timeGridDay: {
                    titleFormat: {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  },
                  timeGridWeek: {
                    titleFormat: { year: "numeric", month: "short" },
                  },
                  dayGridMonth: {
                    titleFormat: { year: "numeric", month: "long" },
                  },
                  listMonth: {
                    titleFormat: { year: "numeric", month: "long" },
                  },
                }}
                events={events.map((event) => {
                  const startDate = new Date(event.start_time);
                  const endDate = new Date(event.end_time);
                  const isOwnedEvent = event.user_id === user.id;

                  const isAllDay =
                    startDate.getHours() === 0 &&
                    startDate.getMinutes() === 0 &&
                    endDate.getHours() === 0 &&
                    endDate.getMinutes() === 0;

                  return {
                    id: event.id,
                    title: event.title,
                    start: startDate,
                    end: endDate,
                    allDay: isAllDay,
                    editable: isOwnedEvent,
                    backgroundColor: isOwnedEvent ? undefined : "#3b82f6", // blue-500
                    borderColor: isOwnedEvent ? undefined : "#3b82f6",
                    extendedProps: {
                      category: event.category?.name || "Uncategorized",
                      isOwnedEvent,
                    },
                  };
                })}
                eventDrop={updateDates}
                handleWindowResize={true}
                plugins={[
                  dayGridPlugin,
                  interactionPlugin,
                  timeGridPlugin,
                  listPlugin,
                ]}
                initialView={getCalendarView}
                selectable={true}
                select={handleDateClick}
                eventClick={handleEventClick}
                eventContent={(eventInfo) => {
                  return (
                    <div className="flex flex-col p-1">
                      <div className="font-medium text-xs md:text-sm truncate">
                        {eventInfo.event.title}
                      </div>
                      {!isMobile && (
                        <div className="text-xs opacity-80">
                          {eventInfo.event.extendedProps.category}
                        </div>
                      )}
                    </div>
                  );
                }}
                contentHeight="auto"
                aspectRatio={isMobile ? 1.2 : isTablet ? 1.5 : 1.8}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Delete Event</h3>
            <p className="mb-4">
              Are you sure you want to delete "{confirmDelete.title}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteEvent}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AddEventModal
        categories={categories}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        onSubmit={handleEventSubmit}
        initialData={selectedEvent}
        onEventUpdate={handleEventUpdate}
      />

      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedEventForModal(null);
        }}
        event={selectedEventForModal}
        onEdit={handleEditFromDetails}
        onDelete={handleDeleteFromDetails}
        user={user}
      />
    </>
  );
}
