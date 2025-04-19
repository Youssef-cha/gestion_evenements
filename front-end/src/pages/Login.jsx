import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import loginImage from "../assets/3d-rendering-abstract-black-white-background.jpg";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getFormLoading, login } from "@/redux/authSlice";
import { Checkbox } from "@/components/ui/checkbox";
import GoogleLoginButton from "@/components/GoogleLoginButton";

const Login = () => {
  const dispatch = useDispatch();
  const formLoading = useSelector(getFormLoading);

  const loginSchema = z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
    remember: z.boolean().optional(),
  });
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });
  const onSubmit = async (credentials) => {
    dispatch(login(credentials));
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-50 dark:bg-neutral-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-xl dark:shadow-neutral-900/50 lg:w-4/5 max-w-5xl w-full flex flex-col lg:flex-row"
      >
        <div className="lg:w-1/2 w-full p-6 md:p-10">
          <div className="mb-8">
            <h2 className="font-bold text-3xl md:text-4xl text-center mb-2 bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-center">
              Sign in to access your account
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 dark:text-neutral-300">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                        <Input
                          placeholder="name@example.com"
                          className="h-11 pl-10 dark:bg-neutral-700 dark:border-neutral-600 focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-neutral-700 dark:text-neutral-300">
                        Password
                      </FormLabel>
                      <Link
                        className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                        to="/forgot-password"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="h-11 pl-10 dark:bg-neutral-700 dark:border-neutral-600 focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-neutral-700 data-[state=checked]:dark:bg-neutral-600"
                      />
                    </FormControl>
                    <div className="leading-none">
                      <FormLabel className="text-sm font-normal text-neutral-600 dark:text-neutral-400">
                        Remember me for 30 days
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-2"
              >
                <Button
                  className="w-full h-11 bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 dark:from-neutral-600 dark:to-neutral-700 dark:hover:from-neutral-500 dark:hover:to-neutral-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  type="submit"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span>Sign In</span>
                  )}
                </Button>
              </motion.div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200 dark:border-neutral-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-neutral-800 px-2 text-neutral-500 dark:text-neutral-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <GoogleLoginButton />

              <div className="mt-6 text-center">
                <p className="text-neutral-600 dark:text-neutral-400">
                  Don't have an account?{" "}
                  <Link
                    className="font-medium text-neutral-800 dark:text-neutral-200 hover:underline transition-all"
                    to="/register"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>

        <div className="lg:w-1/2 relative hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-neutral-800/40 z-10 flex flex-col justify-center items-center p-10 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center"
            >
              <h3 className="text-3xl font-bold mb-4">Welcome Back</h3>
              <p className="text-neutral-200 mb-6">
                Sign in to continue your journey with us
              </p>
              <div className="flex justify-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span className="w-2 h-2 rounded-full bg-white opacity-70"></span>
                <span className="w-2 h-2 rounded-full bg-white opacity-70"></span>
              </div>
            </motion.div>
          </div>
          <img
            className="object-cover h-full w-full"
            src={loginImage || "/placeholder.svg"}
            alt="Abstract background"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
