"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader, Mail, ArrowRight, KeyRound } from "lucide-react"
import { toast } from "sonner"
import axiosClient from "@/axios"
import { motion } from "framer-motion"

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState("")

  const forgotPasswordSchema = z.object({
    email: z.string().email("The email is invalid"),
  })

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (data) => {
    setEmail(data.email)
    const promise = axiosClient.post("/forgot-password", data)
    toast.promise(promise, {
      loading: "Sending reset password link...",
      success: () => {
        setEmailSent(true)
        return "Reset password link has been sent to your email. Please check your inbox."
      },
      error: (error) => {
        return error.response.data.message
      },
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  const iconVariants = {
    initial: { scale: 0.8, rotate: -10 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 1.5,
      },
    },
    hover: {
      rotate: [0, -10, 10, -5, 5, 0],
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 p-4">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full max-w-md relative">
        {/* Decorative elements */}
        <motion.div
          className="absolute -top-16 -left-16 w-32 h-32 bg-neutral-200 dark:bg-neutral-800 rounded-full opacity-50 blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-16 -right-16 w-32 h-32 bg-neutral-300 dark:bg-neutral-700 rounded-full opacity-50 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -10, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        />

        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
          <div className="p-8">
            {!emailSent ? (
              <>
                <motion.div variants={itemVariants} className="text-center mb-8">
                  <motion.div
                    className="mx-auto w-20 h-20 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-6"
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <KeyRound className="h-10 w-10 text-neutral-600 dark:text-neutral-300" />
                  </motion.div>
                  <motion.h2
                    variants={itemVariants}
                    className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2"
                  >
                    Forgot your password?
                  </motion.h2>
                  <motion.p variants={itemVariants} className="text-neutral-600 dark:text-neutral-400 text-sm">
                    No worries! Enter your email and we'll send you a reset link.
                  </motion.p>
                </motion.div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                              <Mail className="h-4 w-4" /> Email Address
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  className="h-12 pl-4 pr-4 dark:bg-neutral-700/50 dark:border-neutral-600 focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-all rounded-xl"
                                  placeholder="name@example.com"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm mt-1" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className="w-full h-12 bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 dark:from-neutral-600 dark:to-neutral-700 dark:hover:from-neutral-500 dark:hover:to-neutral-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        type="submit"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <Loader className="animate-spin mr-2 h-5 w-5" />
                            <span>Sending...</span>
                          </div>
                        ) : (
                          <span className="flex items-center justify-center">
                            Send Reset Link <ArrowRight className="ml-2 h-5 w-5" />
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <motion.div
                  className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <Mail className="h-10 w-10 text-green-600 dark:text-green-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Check your inbox</h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">We've sent a password reset link to:</p>
                <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-3 mb-6">
                  <p className="font-medium text-neutral-800 dark:text-neutral-200">{email}</p>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                  If you don't see the email, check your spam folder or request another link.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  onClick={() => setEmailSent(false)}
                >
                  Back to reset password
                </Button>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="mt-6 text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Remember your password?{" "}
                <Link
                  className="font-medium text-neutral-800 dark:text-neutral-200 hover:underline transition-all"
                  to="/login"
                >
                  Log in
                </Link>
              </p>
            </motion.div>
          </div>

          {/* Bottom decorative wave */}
          <div className="h-8 bg-neutral-100 dark:bg-neutral-700 relative overflow-hidden">
            <svg
              className="absolute bottom-0 w-full h-16 text-white dark:text-neutral-800"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                opacity=".25"
                fill="currentColor"
              ></path>
              <path
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                opacity=".5"
                fill="currentColor"
              ></path>
              <path
                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
