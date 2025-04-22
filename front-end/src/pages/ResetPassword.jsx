"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader, Lock, Eye, EyeOff, Shield, CheckCircle, XCircle } from 'lucide-react'
import axiosClient from "@/axios"
import { motion } from "framer-motion"

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") || ""
  const email = searchParams.get("email") || ""
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  })

  const resetPasswordSchema = z
    .object({
      password: z.string().min(1, "Password is required"),
      password_confirmation: z.string(),
      email: z.string().email("The email is invalid"),
      token: z.string().min(1, "The token is required"),
    })
    .refine(
      (data) => {
        return data.password === data.password_confirmation
      },
      {
        message: "The new password and its confirmation do not match",
        path: ["password_confirmation"],
      }
    )

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password_confirmation: "", password: "", token, email },
    mode: "onChange",
  })

  const onSubmit = async (info) => {
    try {
      const response = await axiosClient.post("/reset-password", info)
      toast.success(response.data.message)
      
      // Show success animation before redirecting
      setTimeout(() => {
        navigate("/login", { replace: true })
      }, 1500)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  // Check password strength and criteria
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0)
      setPasswordCriteria({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
      })
      return
    }

    const criteria = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }

    setPasswordCriteria(criteria)

    // Calculate strength based on criteria
    const strength = Object.values(criteria).filter(Boolean).length
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

  const getStrengthColor = (strength) => {
    if (strength <= 1) return "bg-red-500"
    if (strength <= 3) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStrengthText = (strength) => {
    if (strength <= 1) return "Weak"
    if (strength <= 3) return "Medium"
    return "Strong"
  }

  // Animation variants
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
      rotate: [0, -5, 5, -3, 3, 0],
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 p-4">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full max-w-md relative">
        {/* Decorative elements */}
        <motion.div
          className="absolute -top-16 -right-16 w-32 h-32 bg-neutral-200 dark:bg-neutral-800 rounded-full opacity-50 blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-16 -left-16 w-32 h-32 bg-neutral-300 dark:bg-neutral-700 rounded-full opacity-50 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 10, 0],
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
            <motion.div variants={itemVariants} className="text-center mb-8">
              <motion.div
                className="mx-auto w-20 h-20 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-6"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
              >
                <Shield className="h-10 w-10 text-neutral-600 dark:text-neutral-300" />
              </motion.div>
              <motion.h2
                variants={itemVariants}
                className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2"
              >
                Reset Your Password
              </motion.h2>
              <motion.p variants={itemVariants} className="text-neutral-600 dark:text-neutral-400 text-sm">
                Create a new secure password for your account
              </motion.p>
            </motion.div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="hidden">
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
                    <FormItem className="hidden">
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                          <Lock className="h-4 w-4" /> New Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter new password"
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
                        <FormMessage className="text-red-500 text-sm mt-1" />

                        {field.value && (
                          <div className="mt-3 space-y-3">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs mb-1">
                                <span className="text-neutral-600 dark:text-neutral-400">Password strength:</span>
                                <span
                                  className={`font-medium ${
                                    passwordStrength <= 1
                                      ? "text-red-500"
                                      : passwordStrength <= 3
                                      ? "text-yellow-500"
                                      : "text-green-500"
                                  }`}
                                >
                                  {getStrengthText(passwordStrength)}
                                </span>
                              </div>
                              <div className="flex gap-1">
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
                            </div>

                            <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-lg p-3 text-sm">
                              <p className="text-neutral-600 dark:text-neutral-400 mb-2 text-xs">
                                Your password should have:
                              </p>
                              <ul className="space-y-1 text-xs">
                                <li className="flex items-center">
                                  {passwordCriteria.length ? (
                                    <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-red-500 mr-2" />
                                  )}
                                  <span
                                    className={
                                      passwordCriteria.length
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-neutral-600 dark:text-neutral-400"
                                    }
                                  >
                                    At least 8 characters
                                  </span>
                                </li>
                                <li className="flex items-center">
                                  {passwordCriteria.lowercase ? (
                                    <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-red-500 mr-2" />
                                  )}
                                  <span
                                    className={
                                      passwordCriteria.lowercase
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-neutral-600 dark:text-neutral-400"
                                    }
                                  >
                                    Lowercase letters (a-z)
                                  </span>
                                </li>
                                <li className="flex items-center">
                                  {passwordCriteria.uppercase ? (
                                    <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-red-500 mr-2" />
                                  )}
                                  <span
                                    className={
                                      passwordCriteria.uppercase
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-neutral-600 dark:text-neutral-400"
                                    }
                                  >
                                    Uppercase letters (A-Z)
                                  </span>
                                </li>
                                <li className="flex items-center">
                                  {passwordCriteria.number ? (
                                    <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-red-500 mr-2" />
                                  )}
                                  <span
                                    className={
                                      passwordCriteria.number
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-neutral-600 dark:text-neutral-400"
                                    }
                                  >
                                    Numbers (0-9)
                                  </span>
                                </li>
                                <li className="flex items-center">
                                  {passwordCriteria.special ? (
                                    <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-red-500 mr-2" />
                                  )}
                                  <span
                                    className={
                                      passwordCriteria.special
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-neutral-600 dark:text-neutral-400"
                                    }
                                  >
                                    Special characters (!@#$%^&*)
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                          <Lock className="h-4 w-4" /> Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
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
                        <span>Updating Password...</span>
                      </div>
                    ) : (
                      <span>Reset Password</span>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </div>

          {/* Bottom decorative pattern */}
          <div className="h-8 bg-neutral-100 dark:bg-neutral-700 relative overflow-hidden">
            <svg
              className="absolute bottom-0 w-full h-16 text-white dark:text-neutral-800"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ResetPassword

