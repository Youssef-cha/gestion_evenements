import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import axiosClient from "@/axios";

const ForgotPassword = () => {
  const forgotPasswordSchema = z.object({
    email: z.string().email("the email is invalid"),
  });

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data) => {
    const promise = axiosClient.post("/forgot-password", data);
    toast.promise(promise, {
      loading: "Sending reset password link...",
      success:
        "Reset password link has been sent to your email. Please check your inbox.",
      error: (error) => {
        return error.response.data.message;
      },
    });
  };

  return (
    <div className="border dark:bg-neutral-800 bg-neutral-50 w-11/12 sm:w-2/3 md:w-[500px] lg:w-[600px] mx-auto p-4 sm:p-6 rounded-2xl shadow-lg min-h-[400px]">
      <h2 className="font-bold text-xl sm:text-2xl text-center my-6 sm:my-10">
        Forgot your password?
      </h2>
      <p className="text-center text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-4 sm:mb-6 px-2 sm:px-4">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 sm:space-y-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">email</FormLabel>
                <FormControl>
                  <Input
                    className="text-sm sm:text-base"
                    placeholder="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
          <Button
            className="flex justify-center items-center w-full sm:w-2/3 md:w-1/2 mx-auto text-sm sm:text-base"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader className="inline animate-spin mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            )}
            <span>Send reset link</span>
          </Button>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 text-center mt-4">
            Remember your password?{" "}
            <Link
              className="underline text-neutral-700 dark:text-neutral-300"
              to={"/login"}
            >
              Log in
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPassword;
