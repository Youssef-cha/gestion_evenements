import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import AddAttendeeModal from "./AddAttendeeModal";
import axiosClient from "@/axios";
import { toast } from "sonner";

const formSchema = zod.object({
  title: zod.string().min(1, "Title is required"),
  description: zod.string().min(1, "Description is required"),
  event_category_id: zod.string().min(1, "Category is required"),
  location: zod.string().min(1, "Location is required"),
});

const AddEventModal = ({
  isDialogOpen,
  setIsDialogOpen,
  onSubmit,
  categories,
  initialData = null,
  onEventUpdate = () => {}, // Add this new prop with default value
}) => {
  const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);
  const [attendeeData, setAttendeeData] = useState(null);
  const isEditing = !!initialData;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      event_category_id: "",
      location: "",
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description,
        event_category_id: initialData.event_category_id.toString(),
        location: initialData.location,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        event_category_id: "",
        location: "",
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data) => {
    // Include attendee data in the submission
    const eventData = {
      ...data,
      attendees: attendeeData,
    };
    setIsDialogOpen(false);
    onSubmit(eventData);
    form.reset();
    setAttendeeData(null);
  };

  const handleAddAttendees = async (data) => {
    if (initialData) {
      try {
        const { data: updatedEvent } = await axiosClient.post(
          `events/${initialData.id}/invite`,
          data
        );
        toast.success("Attendees added successfully");
        onEventUpdate(updatedEvent); // Call the new callback with updated event
      } catch (error) {
        console.error("Failed to add attendees:", error);
        toast.error("Failed to add attendees");
        throw error;
      }
    } else {
      setAttendeeData(data);
      setIsAttendeeModalOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{isEditing ? "Edit Event" : "Add Event"}</span>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setIsAttendeeModalOpen(true)}
              >
                <UserPlus className="h-4 w-4" />
                Add Attendees
              </Button>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {isEditing
              ? "Edit your event details below."
              : "Create a new event by filling out the form below."}{" "}
            All fields are required.
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Event description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Event location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-muted-foreground">
                  {!isEditing && attendeeData && (
                    <span>
                      {attendeeData.user_ids?.length || 0} users and{" "}
                      {attendeeData.team_ids?.length || 0} teams selected
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {isEditing ? "Save Changes" : "Add Event"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AddAttendeeModal
        isOpen={isAttendeeModalOpen}
        onClose={() => setIsAttendeeModalOpen(false)}
        onSubmit={handleAddAttendees}
      />
    </>
  );
};

export default AddEventModal;
