import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Link, useLocation, useNavigate } from "react-router-dom"
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
import { dispatch } from "@/store/store"
import { resetPassword, selectIsSendingMail, selectPasswordReseting, selectTempEmail, selectTempToken } from "@/store/slices/authSlice"
import { useSelector } from "react-redux"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    newpassword: z.string()
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine(data => data.newpassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})
const ResetPassword = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { toast } = useToast()
    const tempEmail = useSelector(selectTempEmail);
    const tempToken = useSelector(selectTempToken);
    const isPasswordReseting = useSelector(selectPasswordReseting)    

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newpassword: "",
            confirmPassword: ""
        },
    })

    async function onSubmit(values) {
        try {
            const res = await dispatch(resetPassword({
                new_password: values.newpassword,
                email: tempEmail,
                token: tempToken,
                otp: location.state.otp
            })).unwrap()            
            toast({
                title: "Password Changed !",
                description: res?.data?.message || " User Password Changes Succesfuly ",
            });
            navigate('/login')

        } catch (error) {
            console.log(error);            
            toast({
                title: "Failed !",
                description: error || "Having problem changing password",
                variant: "destructive"
            });
            navigate('/login')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Reset Password</CardTitle>
                    <CardDescription>
                        Enter your new password and confirm it
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="newpassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="test"
                                                placeholder="Enter new password"
                                                {...field}
                                                disabled={isPasswordReseting}
                                                autoComplete="new-password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Confirm your password"
                                                {...field}
                                                disabled={isPasswordReseting}
                                                autoComplete="new-password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={isPasswordReseting}>
                                {isPasswordReseting ? (
                                    <>
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                        Resetting Password...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>

                            <div className="text-sm text-muted-foreground text-center">
                                Remember your password?{" "}
                                <Link
                                    to="/login"
                                    className={cn(
                                        "text-primary hover:underline",
                                        (isPasswordReseting) && "text-muted-foreground cursor-not-allowed pointer-events-none"
                                    )}
                                    onClick={(e) => {
                                        if (isPasswordReseting) {
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

export default ResetPassword