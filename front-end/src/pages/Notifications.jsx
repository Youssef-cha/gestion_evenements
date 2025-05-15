import axiosClient from "@/axios";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Calendar, Clock, MapPin, Check, X, BellOff } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useColorContext } from "@/hooks/useColorContext";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const Notifications = () => {
  const { notifications, setNotifications } = useColorContext();

  useEffect(() => {
    const unreadNotifications = notifications.some(
      (notification) => !notification.read_at
    );
    if (unreadNotifications) {
      axiosClient
        .post("/notifications/read")
        .then(() =>
          setNotifications((prev) =>
            prev.map((notification) => ({
              ...notification,
              read_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
            }))
          )
        )
        .catch((error) => {
          console.error("Error marking notifications as read:", error);
        });
    }
  }, [notifications, setNotifications]);

  const handleResponse = async (notification, response) => {
    const eventId = notification.event_id;
    const notificationId = notification.id;
    try {
      axiosClient.put(`/events/${eventId}/attendance`, { status: response });
      axiosClient.delete(`/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      toast.success("Response sent successfully!");
    } catch (error) {
      console.error("Error updating event attendance:", error);
      toast.error("Error updating event attendance. Please try again.");
    }
  };

  const getNotificationBadgeVariant = (type) => {
    if (type.includes("EventInvitationNotification")) return "default";
    if (type.includes("EventReminderNotification")) return "warning";
    if (type.includes("EventUpdateNotification")) return "secondary";
    return "outline";
  };

  const getNotificationType = (type) => {
    if (type.includes("EventInvitationNotification")) return "Event Invitation";
    if (type.includes("EventReminderNotification")) return "Event Reminder";
    if (type.includes("EventUpdateNotification")) return "Event Update";
    return "Notification";
  };

  const getNotificationIcon = (type) => {
    if (type.includes("EventInvitationNotification"))
      return <Calendar className="h-4 w-4" />;
    if (type.includes("EventReminderNotification"))
      return <Clock className="h-4 w-4" />;
    if (type.includes("EventUpdateNotification"))
      return <MapPin className="h-4 w-4" />;
    return <Bell className="h-4 w-4" />;
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = format(new Date(notification.created_at), "MMM d, yyyy");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="shadow-md border-muted">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <span>Notifications</span>
              {notifications.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {notifications.length}
                </Badge>
              )}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Mark all as read</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mark all as read</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh] pr-4">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <BellOff className="h-12 w-12 mb-4 text-muted" />
                <p className="text-center font-medium">No notifications</p>
                <p className="text-center text-sm">You're all caught up!</p>
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-6">
                  {Object.entries(groupedNotifications).map(
                    ([date, dateNotifications]) => (
                      <div key={date} className="space-y-3">
                        <div className="sticky top-0 bg-card z-10 py-2">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            {date}
                          </h3>
                          <Separator className="mt-2" />
                        </div>
                        {dateNotifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 border rounded-lg hover:bg-accent/30 transition-all duration-200 shadow-sm"
                          >
                            <div className="flex items-start gap-4">
                              <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                {notification.sender?.avatar ? (
                                  <AvatarImage
                                    src={
                                      notification.sender.avatar ||
                                      "/placeholder.svg"
                                    }
                                    alt={notification.sender.name}
                                  />
                                ) : (
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {getInitials(
                                      notification.sender?.name || "User"
                                    )}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={getNotificationBadgeVariant(
                                        notification.type
                                      )}
                                      className="flex items-center gap-1"
                                    >
                                      {getNotificationIcon(notification.type)}
                                      <span>
                                        {getNotificationType(notification.type)}
                                      </span>
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {format(
                                        new Date(notification.created_at),
                                        "h:mm a"
                                      )}
                                    </span>
                                  </div>
                                </div>

                                <p className="text-sm font-medium">
                                  {notification.message}
                                </p>

                                {notification.sender && (
                                  <p className="text-xs text-muted-foreground">
                                    From: {notification.sender.name}
                                  </p>
                                )}

                                {notification.title && (
                                  <div className="mt-2 text-sm space-y-2 bg-muted/50 p-3 rounded-md border border-border/50">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-primary" />
                                      <span className="font-medium">
                                        {notification.title}
                                      </span>
                                    </div>
                                    {notification.start_time && (
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                          {format(
                                            new Date(notification.start_time),
                                            "MMM d, yyyy • h:mm a"
                                          )}
                                        </span>
                                      </div>
                                    )}
                                    {notification.location && (
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                          {notification.location}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {notification.type.includes("invitation") && (
                                  <div className="flex items-center gap-2 mt-3">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 transition-colors"
                                      onClick={() =>
                                        handleResponse(notification, "accepted")
                                      }
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Accept
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-colors"
                                      onClick={() =>
                                        handleResponse(notification, "declined")
                                      }
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Decline
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </AnimatePresence>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Notifications;
