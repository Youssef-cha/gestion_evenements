import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick

import { useEffect, useState } from "react";
import { formatDate } from "@fullcalendar/core";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import CalendarSkeleton from "@/components/CalendarSkeleton";
import { motion } from "framer-motion";
import axiosClient from "@/axios";
import AddEventModal from "@/components/AddEventModal";
import listPlugin from "@fullcalendar/list";
export default function Calendar() {
  const { open } = useSidebar();

  const [events, setEvents] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    setShowSkeleton(true);
    setTimeout(() => setShowSkeleton(false), 200);
  }, [open]);
  const fetchEvents = async () => {
    try {
      const response = await axiosClient.get("events");
      setEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get("eventCategories");
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };
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
      data.start_time = selectedDate.startStr;
      data.end_time = selectedDate.endStr;
      const response = await axiosClient.post("events", data);
      setEvents([...events, response.data]);
    } catch (error) {
      console.error(error);
    } finally {
      selectedDate.view.calendar.unselect();
      setSelectedDate(null);
    }
  };

  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`
      )
    ) {
      try {
        axiosClient.delete(`events/${selected.event.id}`);
        setEvents(events.filter((event) => event.id != selected.event.id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full px-4 lg:px-10 justify-start items-start gap-4 lg:gap-8">
        <div className="calendar-container">
          <h3 className="calendar-header">Calendar Events</h3>
          <ul className="space-y-4 px-4 lg:px-7">
            {events.length === 0 ? (
              <div className="italic text-center text-gray-500 text-base lg:text-lg font-bold">
                No Events Present
              </div>
            ) : (
              events.map((event) => (
                <li className="calendar-event-item" key={event.id}>
                  <span>{event.title}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="calendar-event-category">
                      {event.category?.name}
                    </span>
                  </div>
                  <label className="calendar-event-date">
                    {formatDate(event.start_time, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    /{" "}
                    {formatDate(event.end_time, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </label>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="w-full lg:w-9/12 mt-4 lg:mt-8">
          {showSkeleton ? (
            <CalendarSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.4 }}
              className="calendar-wrapper"
            >
              <FullCalendar
                height={"85vh"}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,listMonth",
                }}
                events={events.map((event) => ({
                  id: event.id,
                  title: event.title,
                  start: event.start_time,
                  end: event.end_time,
                }))}
                handleWindowResize
                plugins={[
                  dayGridPlugin,
                  interactionPlugin,
                  timeGridPlugin,
                  listPlugin,
                ]}
                initialView="dayGridMonth"
                selectable={true}
                select={handleDateClick}
                eventClick={handleEventClick}
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
    </>
  );
}
