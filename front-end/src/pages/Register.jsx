"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, User, Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { getFormLoading, register } from "@/redux/authSlice"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

const Register = () => {
  const formLoading = useSelector(getFormLoading)
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

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
    mode: "onChange",
  })

  const onSubmit = async (credentials) => {
    dispatch(register(credentials))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  // Check password strength
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    // Length check
    if (password.length >= 8) strength += 1
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1
    // Contains number
    if (/[0-9]/.test(password)) strength += 1
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    setPasswordStrength(strength)
  }

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "password") {
        checkPasswordStrength(value.password)
      }
    })
    return () => subscription.unsubscribe()
  }, [form.watch])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const formItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  const getStrengthColor = (strength) => {
    if (strength <= 1) return "bg-red-500"
    if (strength <= 3) return "bg-yellow-500"
    return "bg-green-500"
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl dark:shadow-neutral-900/50 w-full max-w-5xl flex flex-col lg:flex-row"
      >
        {/* Form Section */}
        <motion.div variants={itemVariants} className="lg:w-1/2 w-full p-6 md:p-10">
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
              className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-neutral-800 to-neutral-600 dark:from-neutral-600 dark:to-neutral-400 rounded-full text-white"
            >
              <User className="h-8 w-8" />
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="font-bold text-3xl md:text-4xl mb-2 bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent"
            >
              Create Account
            </motion.h2>
            <motion.p variants={itemVariants} className="text-neutral-500 dark:text-neutral-400">
              Join us today and get access to all features
            </motion.p>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <motion.div variants={formItemVariants}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                        <User className="h-4 w-4" /> Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            placeholder="Enter your name"
                            className="h-12 pl-4 pr-10 dark:bg-neutral-700/50 dark:border-neutral-600 focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-all rounded-xl"
                            {...field}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400 group-focus-within:text-neutral-600 dark:group-focus-within:text-neutral-300 transition-colors">
                            <User className="h-5 w-5" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={formItemVariants}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            placeholder="name@example.com"
                            className="h-12 pl-4 pr-10 dark:bg-neutral-700/50 dark:border-neutral-600 focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-all rounded-xl"
                            {...field}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400 group-focus-within:text-neutral-600 dark:group-focus-within:text-neutral-300 transition-colors">
                            <Mail className="h-5 w-5" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={formItemVariants}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                        <Lock className="h-4 w-4" /> Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a secure password"
                            className="h-12 pl-4 pr-10 dark:bg-neutral-700/50 dark:border-neutral-600 focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-all rounded-xl"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      {field.value && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <motion.div
                                key={level}
                                className={`h-1 flex-1 rounded-full ${
                                  level <= passwordStrength
                                    ? getStrengthColor(passwordStrength)
                                    : "bg-neutral-200 dark:bg-neutral-700"
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.3, delay: level * 0.1 }}
                              ></motion.div>
                            ))}
                          </div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {passwordStrength <= 1
                              ? "Weak password"
                              : passwordStrength <= 3
                                ? "Medium password"
                                : "Strong password"}
                          </p>
                        </div>
                      )}
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={formItemVariants}>
                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" /> Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="h-12 pl-4 pr-10 dark:bg-neutral-700/50 dark:border-neutral-600 focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-all rounded-xl"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                variants={formItemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-2"
              >
                <Button
                  className="w-full h-12 bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 dark:from-neutral-600 dark:to-neutral-700 dark:hover:from-neutral-500 dark:hover:to-neutral-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  type="submit"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      Create Account <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  )}
                </Button>
              </motion.div>

              <motion.div variants={formItemVariants} className="mt-6 text-center space-y-2">
                <p className="text-neutral-600 dark:text-neutral-400">
                  Already have an account?{" "}
                  <Link
                    className="font-medium text-neutral-800 dark:text-neutral-200 hover:underline transition-all"
                    to="/login"
                  >
                    Log in
                  </Link>
                </p>

                <p className="text-neutral-500 dark:text-neutral-500 text-sm">
                  By signing up, you agree to our{" "}
                  <Link className="text-neutral-700 dark:text-neutral-300 hover:underline" to="/terms">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link className="text-neutral-700 dark:text-neutral-300 hover:underline" to="/privacy">
                    Privacy Policy
                  </Link>
                </p>
              </motion.div>
            </form>
          </Form>
        </motion.div>

        {/* Decorative Section */}
        <motion.div variants={itemVariants} className="lg:w-1/2 relative hidden lg:block overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-neutral-800/40 z-10 flex flex-col justify-center items-center p-10 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center max-w-md"
            >
              <motion.h3
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                Join Our Community
              </motion.h3>
              <motion.p
                className="text-neutral-200 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                Create an account to access all features and join thousands of users who trust our platform for their
                event management needs.
              </motion.p>

              <motion.div
                className="flex justify-center space-x-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className={`w-2 h-2 rounded-full ${i === 1 ? "bg-white" : "bg-white/70"}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.1 + i * 0.1, type: "spring", stiffness: 300, damping: 10 }}
                  ></motion.span>
                ))}
              </motion.div>

              <motion.div
                className="mt-10 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <div className="relative w-64 h-64">
                  {/* Abstract decorative elements */}
                  <motion.div
                    className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-neutral-300/20 to-neutral-500/20 blur-xl"
                    animate={{
                      x: [0, 10, 0],
                      y: [0, -10, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 8,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute right-0 bottom-0 w-32 h-32 rounded-full bg-gradient-to-r from-neutral-400/20 to-neutral-600/20 blur-xl"
                    animate={{
                      x: [0, -15, 0],
                      y: [0, 15, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 10,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
          <div className="absolute inset-0 bg-neutral-900 z-0">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-500/30 via-neutral-800/30 to-neutral-900/30"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-500/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-500/50 to-transparent"></div>
              <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-neutral-500/50 to-transparent"></div>
              <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-neutral-500/50 to-transparent"></div>
            </div>
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Register
