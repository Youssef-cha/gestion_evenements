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
import { useDispatch } from "react-redux";
import { login } from "@/redux/authSlice";
const Login = () => {
  const dispatch = useDispatch();
  const loginSchema = z.object({
    email: z.string().email("the email is invalid"),
    password: z.string().min(1, "password is needed"),
  });
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const onSubmit = async (credentials) => {
    dispatch(login(credentials));
  };
  return (
    <div className="border bg-neutral-50 w-1/3 mx-auto px-6 rounded-2xl shadow-lg h-[450px]">
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
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader className="inline animate-spin" />
            )}
            <span>Submit</span>
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
