import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

import { Link, useNavigate } from "react-router-dom"
import { dispatch } from "@/store/store"
import { useSelector } from "react-redux"
import { sendMail, setFlowType, setTempUserData } from "@/store/slices/authSlice";
// icons
import { ReloadIcon } from "@radix-ui/react-icons";
import { selectIsSendingMail, selectRequiresOTP } from "@/store/slices/authSlice";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { registerSchema } from "@/schema/formSchemas";

const RegisterForm = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const isSendingMail = useSelector(selectIsSendingMail)
  const requiresOTP = useSelector(selectRequiresOTP)

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prevState => !prevState);
  };

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "@mailinator.com",
      password: "123123",
      confirmPassword: "123123",
    },
  })

  const onSubmit = async (values) => {
    try {
      dispatch(setFlowType('register'))
      dispatch(setTempUserData(values)); // name, email, password, c-password
      await dispatch(sendMail({
        email: values.email,
        request_type: 1,
        resend: 1
      })).unwrap()
      navigate('/otp-verification')
    } catch (error) {
      toast({
        title: "Error",
        description: error || "Failed to send OTP",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: 'inherit' }}>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: 'inherit' }}>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: 'inherit' }}>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                          {showPassword ? (
                            <Eye size={20} />
                          ) : (
                            <EyeOff size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: 'inherit' }}>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                          {showConfirmPassword ? (
                            <Eye size={20} />
                          ) : (
                            <EyeOff size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSendingMail}
              >
                {isSendingMail ? (
                  <div className="flex items-center gap-2">
                    <ReloadIcon className="h-4 w-4 animate-spin" />
                    Sending OTP...
                  </div>
                ) : (
                  "Register"
                )}
              </Button>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className={cn(
                    "text-primary hover:underline",
                    isSendingMail && "text-muted-foreground cursor-not-allowed pointer-events-none"
                  )}
                  onClick={(e) => {
                    if (isSendingMail) {
                      e.preventDefault();
                    }
                  }}
                >
                  Login here
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterForm