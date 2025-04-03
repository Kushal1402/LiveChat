import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { dispatch } from "@/store/store"
import { selectIsSendingMail, sendMail, setFlowType } from "@/store/slices/authSlice"
import { useToast } from "@/hooks/use-toast"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useSelector } from "react-redux"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

const ForgotPassword = () => {
    const navigate = useNavigate()
    const { toast } = useToast()
    const isSendingMail = useSelector(selectIsSendingMail)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "ramji@mailinator.com",
        },
    })

    async function onSubmit(values) {
        try {
            dispatch(setFlowType('forgot-password'))
            await dispatch(sendMail({
                email: values.email,
                request_type: 2,
                resend: 1
            })).unwrap();
            navigate('/otp-verification');

        } catch (error) {
            console.log(error);
            
            toast({
                title: "Error",
                description:"Failed to send OTP",
                variant: "destructive"
            });
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 ">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email to receive a password reset OTP
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your email"
                                                {...field}
                                                disabled={isSendingMail}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={isSendingMail}>
                                {isSendingMail ?
                                    <div className="flex items-center gap-2">
                                        <ReloadIcon className="h-4 w-4 animate-spin" />
                                        Sending OTP...
                                    </div> :
                                    "Send OTP"
                                }
                            </Button>

                            <div className="text-sm text-muted-foreground text-center">
                                Remember your password?{" "}
                                <Link
                                    to="/login"
                                    className={cn(
                                        "text-primary hover:underline",
                                        (isSendingMail) && "text-muted-foreground cursor-not-allowed pointer-events-none"
                                    )}
                                    onClick={(e) => {
                                        if (isSendingMail) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    Sign in here
                                </Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default ForgotPassword