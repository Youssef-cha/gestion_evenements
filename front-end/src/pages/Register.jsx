"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, User, Mail, Lock } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { getFormLoading, register } from "@/redux/authSlice"
import { motion } from "framer-motion"
import loginImage from "../assets/3d-rendering-abstract-black-white-background.jpg"

const Register = () => {
  const formLoading = useSelector(getFormLoading)
  const dispatch = useDispatch()
  const registerSchema = z
    .object({
      name: z.string().min(1, "Name is required"),
      email: z.string().min(1, "Email is required").email("Please enter a valid email"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      password_confirmation: z.string(),
    })
    .refine(
      (data) => {
        return data.password === data.password_confirmation
      },
      {
        message: "Passwords don't match",
        path: ["password_confirmation"],
      },
    )
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  })
  const onSubmit = async (credentials) => {
    dispatch(register(credentials))
  }

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
              Create Account
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-center">
              Join us today and get access to all features
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 dark:text-neutral-300">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                        <Input
                          placeholder="Enter your name"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 dark:text-neutral-300">Email Address</FormLabel>
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
                    <FormLabel className="text-neutral-700 dark:text-neutral-300">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                        <Input
                          type="password"
                          placeholder="Create a secure password"
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
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 dark:text-neutral-300">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          className="h-11 pl-10 dark:bg-neutral-700 dark:border-neutral-600 focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
                <Button
                  className="w-full h-11 bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 dark:from-neutral-600 dark:to-neutral-700 dark:hover:from-neutral-500 dark:hover:to-neutral-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  type="submit"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <span>Sign Up</span>
                  )}
                </Button>
              </motion.div>

              <div className="mt-6 text-center">
                <p className="text-neutral-600 dark:text-neutral-400">
                  Already have an account?{" "}
                  <Link
                    className="font-medium text-neutral-800 dark:text-neutral-200 hover:underline transition-all"
                    to="/login"
                  >
                    Log in
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
              <h3 className="text-3xl font-bold mb-4">Welcome to our platform</h3>
              <p className="text-neutral-200 mb-6">Create an account to get started on your journey</p>
              <div className="flex justify-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-white opacity-70"></span>
                <span className="w-2 h-2 rounded-full bg-white"></span>
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
  )
}

export default Register
