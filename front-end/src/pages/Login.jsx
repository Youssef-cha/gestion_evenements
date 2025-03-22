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
import { useDispatch, useSelector } from "react-redux";
import { getAuthErrors, getFormLoading, login } from "@/redux/authSlice";

const Login = () => {
  const errors = useSelector(getAuthErrors);
  const formLoading = useSelector(getFormLoading);
  const dispatch = useDispatch();
  const loginSchema = z.object({
    email: z.string().email("the email is invalid"),
    password: z.string().min(1, "password is required"),
  });
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const onSubmit = async (credentials) => {
    dispatch(login(credentials));
  };
  if (!formLoading && errors) {
    Object.keys(errors).forEach((key) => {
      toast.error(errors[key][0]);
    });
  }

  return (
    <div className="border dark:bg-neutral-800 bg-neutral-50 w-2/3 sm:w-2/4 md:w-[400px] mx-auto px-6 rounded-2xl shadow-lg h-[450px]">
      <h2 className="font-bold text-2xl text-center my-10">Login</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <FormMessage className={"h-4"} />
              </FormItem>
            )}
          />
          <Button
            className="flex  justify-center items-center w-1/2 mx-auto"
            type="submit"
            disabled={formLoading}
          >
            {formLoading && <Loader className="inline animate-spin" />}
            <span>Log in</span>
          </Button>
          <p className="text-neutral-600 text-center">
            don't have an account{" "}
            <Link className="underline text-neutral-700" to={"/register"}>
              Sign up
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default Login;
