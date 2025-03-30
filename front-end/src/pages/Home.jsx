import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Users,
  CalendarCheck,
  Plus,
  Bell,
  CheckCircle2,
  XCircle,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import axiosClient from "@/axios";
import { formatDate } from "@fullcalendar/core";
import { Link } from "react-router";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosClient.get("events");
        setEvents(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Get today's events
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEvents = events.filter((event) => {
    const eventDate = new Date(event.start_time);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });

  // Get upcoming events (next 7 days)
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.start_time);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate > today;
    })
    .slice(0, 5); // Show only next 5 events

  // Calculate statistics
  const stats = {
    totalEvents: events.length,
    todayEvents: todayEvents.length,
    upcomingEvents: events.filter((event) => new Date(event.start_time) > today)
      .length,
    totalCategories: new Set(events.map((event) => event.category?.name)).size,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Here's your calendar overview
          </p>
        </div>
        <Link to="/calendar">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Events
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <Bell className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Event Categories
            </CardTitle>
            <Tag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Events and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5" />
              Today's Events
            </CardTitle>
            <CardDescription>Your events scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayEvents.length === 0 ? (
                <p className="text-center text-neutral-500">
                  No events scheduled for today
                </p>
              ) : (
                todayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(event.start_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          {event.category?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Your next scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <p className="text-center text-neutral-500">
                  No upcoming events
                </p>
              ) : (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(event.start_time, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(event.start_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          {event.category?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
