import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Globe, Info } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const EventDetailsModal = ({ 
  isOpen, 
  onClose, 
  event, 
  onEdit, 
  onDelete 
}) => {
  if (!event) return null;

  const organizer = event.attendees?.find(attendee => attendee.id === event.user_id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <>
            <DialogHeader className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <DialogTitle className="text-2xl font-bold">
                    {event.title}
                  </DialogTitle>
                  <DialogDescription>
                    Organized by {organizer?.name || "Unknown"}
                  </DialogDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(event)}
                    className="hover:bg-secondary"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(event)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {event.category?.name || "Uncategorized"}
                </Badge>
                {event.is_virtual && (
                  <Badge variant="secondary" className="text-xs">
                    <Globe className="h-3 w-3 mr-1" />
                    Virtual Event
                  </Badge>
                )}
                {event.max_attendees && (
                  <Badge variant="secondary" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {event.attendees?.length || 0}/{event.max_attendees} Attendees
                  </Badge>
                )}
              </div>
            </DialogHeader>

            <ScrollArea className="space-y-6 pr-4">
              <div className="space-y-4 bg-secondary/10 p-4 rounded-lg">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(event.start_time), "EEEE, MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(event.start_time), "h:mm a")} -{" "}
                      {format(new Date(event.end_time), "h:mm a")}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    About this event
                  </h4>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Attendees ({event.attendees?.length || 0})
                </h3>
                <div className="grid gap-4">
                  {event.attendees?.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="flex items-center justify-between p-2 hover:bg-secondary/10 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={attendee.avatar} />
                          <AvatarFallback>
                            {attendee.name[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {attendee.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {attendee.email}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          attendee.pivot.status === "accepted"
                            ? "success"
                            : attendee.pivot.status === "declined"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {attendee.pivot.status.charAt(0).toUpperCase() +
                          attendee.pivot.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;