import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axiosClient from "@/axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { getUser } from "@/redux/authSlice";
import { Loader } from "lucide-react";

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  const schema = z
    .object({
      name: z.string().nonempty("Name is required"),
      email: z.string().nonempty("Email is required").email("Email is invalid"),
      old_password: z.string().optional(),
      password: z.string().optional(),
      password_confirmation: z.string().optional(),
    })
    .refine(
      (data) => {
        if (
          (data.old_password && !data.password) ||
          (data.password && !data.old_password)
        )
          return false;
        return true;
      },
      {
        message:
          "Both current password and new password are required to change password",
        path: ["old_password"],
      }
    )
    .refine(
      (data) => {
        if (!data.password) return true;
        return data.password === data.password_confirmation;
      },
      {
        message: "Password confirmation does not match new password",
        path: ["password_confirmation"],
      }
    );
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      old_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const [passwordSectionOpen, setPasswordSectionOpen] = useState(false);

  const onSubmit = async (formData) => {
    try {
      const response = await axiosClient.put("/users", formData);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      dispatch(getUser());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Edit Profile</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...form.register("name")} />
              </FormControl>
              <FormMessage>{form.formState.errors.name?.message}</FormMessage>
            </FormItem>

            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...form.register("email")} />
              </FormControl>
              <FormMessage>{form.formState.errors.email?.message}</FormMessage>
            </FormItem>

            <Separator className="my-4" />

            <Collapsible
              open={passwordSectionOpen}
              onOpenChange={setPasswordSectionOpen}
            >
              <CollapsibleTrigger className="w-full text-left font-medium">
                Change Password
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-4 pt-4 transition-all">
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...form.register("old_password")} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.old_password?.message}
                  </FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...form.register("password")} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.password?.message}
                  </FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...form.register("password_confirmation")}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.password_confirmation?.message}
                  </FormMessage>
                </FormItem>
              </CollapsibleContent>
            </Collapsible>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-transparent hover:bg-zinc-800 border-zinc-700 text-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader className="inline animate-spin" />
                )}
                <span>Save Changes</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
