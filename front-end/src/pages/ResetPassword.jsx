import React from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
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
import axiosClient from "@/axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const resetPasswordSchema = z
    .object({
      password: z.string().min(1, "password is required"),
      password_confirmation: z.string(),
      email: z.string().email("the email is invalid"),
      token: z.string().min(1, "the token is required"),
    })
    .refine(
      (data) => {
        return data.password === data.password_confirmation;
      },
      {
        message: "the new password and its confirmation do not match",
        path: ["password_confirmation"],
      }
    );
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password_confirmation: "", password: "", token, email },
  });
  const onSubmit = async (info) => {
    try {
      const response = await axiosClient.post("/reset-password", info);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="border dark:bg-neutral-800 bg-neutral-50 w-2/3 sm:w-2/4 md:w-[400px] mx-auto px-6 rounded-2xl shadow-lg h-[400px]">
      <h2 className="font-bold text-2xl text-center my-10">
        reset your password
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className={"hidden"}>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem className={"hidden"}>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>new password</FormLabel>
                <FormControl>
                  <Input
                    type={"password"}
                    placeholder="new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>confirm your new password</FormLabel>
                <FormControl>
                  <Input
                    type={"password"}
                    placeholder="confirmation"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="flex  justify-center items-center w-1/2 mx-auto"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader className="inline animate-spin" />
            )}
            <span>save</span>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPassword;
