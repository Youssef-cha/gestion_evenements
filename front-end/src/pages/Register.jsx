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
import { useDispatch, useSelector } from "react-redux";
import { getAuthErrors, getFormLoading, register } from "@/redux/authSlice";
import { toast, Toaster } from "sonner";
const Register = () => {
  const errors = useSelector(getAuthErrors);
  const formLoading = useSelector(getFormLoading);
  const dispatch = useDispatch();
  const loginSchema = z
    .object({
      name: z.string().min(1, "the name is required"),
      email: z
        .string()
        .min(1, "the email is required")
        .email("the email is invalid"),
      password: z.string().min(1, "password is required"),
      password_confirmation: z.string(),
    })
    .refine(
      (data) => {
        return data.password === data.password_confirmation;
      },
      {
        message: "password and its confirmation do not match",
        path: ["password_confirmation"],
      }
    );
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });
  const onSubmit = async (credentials) => {
    dispatch(register(credentials));
  };
  // still need somework 
  !formLoading && errors && toast.error("email has already been taken");

  return (
    <div className="border bg-neutral-50 w-2/3 sm:w-2/4 md:w-[400px] mx-auto px-6 rounded-2xl shadow-lg h-[500px]">
      <h2 className="font-bold text-2xl text-center my-6">Sign up</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>user name</FormLabel>
                <FormControl>
                  <Input placeholder="user name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
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
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input type={"password"} placeholder="password" {...field} />
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
                <FormLabel>confirm password</FormLabel>
                <FormControl>
                  <Input
                    type={"password"}
                    placeholder="confirm the password here..."
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
            disabled={formLoading}
          >
            {formLoading && <Loader className="inline animate-spin" />}
            <span>sign up</span>
          </Button>
          <p className="text-neutral-600 text-center">
            already have an account?{" "}
            <Link className="underline text-neutral-700" to={"/login"}>
              Log in
            </Link>
          </p>
        </form>
      </Form>
      <Toaster richColors />
    </div>
  );
};

export default Register;
