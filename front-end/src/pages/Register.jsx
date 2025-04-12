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
import { getFormLoading, register } from "@/redux/authSlice";
import { motion } from "framer-motion";
import loginImage from "../assets/3d-rendering-abstract-black-white-background.jpg";

const Register = () => {
  const formLoading = useSelector(getFormLoading);
  const dispatch = useDispatch();
  const registerSchema = z
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
    resolver: zodResolver(registerSchema),
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-neutral-800 lg:h-[700px] rounded-md overflow-hidden lg:w-5xl w-10/12 flex"
    >
      <div className="lg:w-1/2 w-full p-10">
        <h2 className="font-bold text-3xl capitalize text-center my-10">
          Sign up
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    <Input
                      type={"password"}
                      placeholder="password"
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
              className="flex justify-center items-center w-1/2 mx-auto"
              type="submit"
              disabled={formLoading}
            >
              {formLoading && <Loader className="inline animate-spin" />}
              <span>Sign up</span>
            </Button>
            <p className="text-neutral-600 dark:text-neutral-400 text-center">
              do you have an account?{" "}
              <Link
                className="underline text-neutral-700 dark:text-neutral-300"
                to={"/login"}
              >
                Log in
              </Link>
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 text-center mt-4">
              <Link
                className="underline text-neutral-700 dark:text-neutral-300"
                to={"/forgot-password"}
              >
                Forgot password?
              </Link>
            </p>
          </form>
        </Form>
      </div>
      <div className="w-1/2 relative hidden overflow-hidden before:absolute before:bg-gradient-to-t before:inset-0 before:from-black/60 before:to-bl-800/30 lg:block">
        <img className="object-cover" src={loginImage} alt="register" />
      </div>
    </motion.div>
  );
};

export default Register;
