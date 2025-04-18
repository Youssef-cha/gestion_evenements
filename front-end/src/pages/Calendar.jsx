import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import listPlugin from "@fullcalendar/list";
import { useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import CalendarSkeleton from "@/components/CalendarSkeleton";
import axiosClient from "@/axios";
import AddEventModal from "@/components/AddEventModal";
import { motion } from "framer-motion";
import CalendarSettings from "@/components/CalendarSettings";
import { Edit } from "lucide-react";
import EditEventModal from "@/components/EditEventModal";
// Remove formatDate import and add date-fns imports
import { format } from "date-fns";

export default function Calendar() {
  const { open } = useSidebar();
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem("calendar_settings")) || {
      showPassedEvents: false,
      showFutureEvents: true,
      showWeekendDays: true,
    }
  );
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchEvents = async () => {
    setIsEventsLoading(true);
    try {
      const { data } = await axiosClient.get("events");
      setAllEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsEventsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axiosClient.get("eventCategories");
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    const currentDate = new Date().setHours(0, 0, 0, 0);
    localStorage.setItem("calendar_settings", JSON.stringify(settings));
    const filteredEvents = allEvents.filter((event) => {
      const eventDate = new Date(event.start_time).setHours(0, 0, 0, 0);
      const isPastEvent = eventDate < currentDate;
      return (
        (settings.showPassedEvents || !isPastEvent) &&
        (settings.showFutureEvents || isPastEvent)
      );
    });
    setEvents(filteredEvents);
  }, [settings, allEvents]);

  useEffect(() => {
    setShowSkeleton(true);
    const timer = setTimeout(() => setShowSkeleton(false), 200);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const handleDateClick = (selected) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleAddEvent = async (data) => {
    try {
      const eventData = {
        ...data,
        start_time: format(selectedDate.start, "yyyy-MM-dd HH:mm:ss"),
        end_time: format(selectedDate.end, "yyyy-MM-dd HH:mm:ss"),
      };
      const { data: newEvent } = await axiosClient.post("events", eventData);
      setAllEvents((prev) => [newEvent, ...prev]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to add event:", error);
    } finally {
      selectedDate?.view.calendar.unselect();
      setSelectedDate(null);
    }
  };

  const handleEventClick = async (id, title) => {
    if (
      window.confirm(`Are you sure you want to delete the event '${title}'`)
    ) {
      try {
        await axiosClient.delete(`events/${id}`);
        setAllEvents(allEvents.filter((event) => event.id != id));
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleUpdateEvent = async (newData) => {
    try {
      const eventData = {
        ...newData,
        start_time: selectedEvent.start_time,
        end_time: selectedEvent.end_time,
      };
      const { data } = await axiosClient.put(
        `events/${selectedEvent.id}`,
        eventData
      );
      setAllEvents((prev) =>
        prev.map((event) => (event.id === selectedEvent.id ? data : event))
      );
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update event:", error);
    } finally {
      setSelectedEvent(null);
    }
  };

  const renderEventList = () => {
    if (isEventsLoading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <li
          key={index}
          className="calendar-event-item opacity-50 w-[280px] sm:w-[320px] lg:w-full min-h-[100px] sm:min-h-[120px]"
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
        <div className="italic text-center text-gray-500 text-base lg:text-lg font-bold w-[280px] sm:w-[320px] lg:w-full min-h-[100px] sm:min-h-[120px]">
          No Events Present
        </div>
      );
    }

    return events.map((event) => (
      <li
        className="calendar-event-item w-[250px] sm:w-[300px] md:w-[320px] lg:w-full xl:w-[380px] 2xl:w-full min-h-[90px] sm:min-h-[110px] md:min-h-[120px] p-2 sm:p-3 md:p-4 hover:shadow-lg transition-all duration-300"
        key={event.id}
      >
        <div className="flex justify-between items-start gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm md:text-base xl:text-lg font-medium line-clamp-2">
            {event.title}
          </span>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => handleEditClick(event)}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>
            <button
              onClick={() => handleEventClick(event.id, event.title)}
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="calendar-event-category text-xs sm:text-sm">
            {event.category?.name || "Uncategorized"}
          </span>
        </div>
        <label className="calendar-event-date text-xs sm:text-sm mt-2 block">
          {format(new Date(event.start_time), "MMM d, yyyy")} /{" "}
          {format(new Date(event.end_time), "MMM d, yyyy")}
        </label>
      </li>
    ));
  };
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
      setEvents(events.map((el) => (el.id == event.id ? data : el)));
      setAllEvents(allEvents.map((el) => (el.id == event.id ? data : el)));
    } catch (error) {
      console.error("Failed to update event date:", error);
      selected.revert();
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full px-2 sm:px-4 lg:px-10 justify-start items-start gap-2 sm:gap-4 lg:gap-8">
        <div className="calendar-container w-full lg:w-3/12">
          <div className="calendar-header justify-between flex items-center p-2 sm:p-3">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">
              Calendar Events
            </h3>
            <CalendarSettings settings={settings} setSettings={setSettings} />
          </div>
          <ul className="flex flex-row lg:flex-col gap-2 sm:gap-4 px-2 sm:px-4 lg:px-7 py-4 w-fit sm:w-auto h-fit">
            {renderEventList()}
          </ul>
        </div>
        <div className="w-full lg:w-9/12 mt-2 sm:mt-4 lg:mt-8">
          {showSkeleton ? (
            <CalendarSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.4 }}
              className="calendar-wrapper rounded-lg shadow-sm"
            >
              <FullCalendar
                eventResize={updateDates}
                firstDay={1}
                editable
                eventDurationEditable
                weekends={settings.showWeekendDays}
                height="85vh"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right:
                    window.innerWidth < 640
                      ? "dayGridMonth,listMonth"
                      : "dayGridMonth,timeGridWeek,listMonth",
                }}
                events={events.map((event) => {
                  const startDate = new Date(event.start_time);
                  const endDate = new Date(event.end_time);

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
                initialView={
                  window.innerWidth < 640 ? "listMonth" : "dayGridMonth"
                }
                selectable={true}
                select={handleDateClick}
                eventClick={({ event: { id, title } }) => {
                  handleEventClick(id, title);
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
      <AddEventModal
        categories={categories}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        handleAddEvent={handleAddEvent}
      />
      <EditEventModal
        categories={categories}
        isDialogOpen={isEditDialogOpen}
        setIsDialogOpen={setIsEditDialogOpen}
        handleUpdateEvent={handleUpdateEvent}
        initialData={selectedEvent}
      />
    </>
  );
}
