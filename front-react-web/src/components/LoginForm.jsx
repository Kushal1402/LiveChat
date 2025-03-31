import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { dispatch } from "@/store/store"
import { login, selectAuthLoading } from "@/store/slices/authSlice"
import { useToast } from "@/hooks/use-toast"
import { useSelector } from "react-redux"
import { ReloadIcon } from "@radix-ui/react-icons"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
});

export function LoginForm({
    className,
    ...props
}) {

    const navigate = useNavigate()
    const { toast } = useToast()

    const isLoading = useSelector(selectAuthLoading)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "@mailinator.com",
            password: "",
        },
    })

    const handleLogin = async (values) => {
        try {
            const res = await dispatch(login(values)).unwrap();
            if (res.status === 307) {
                try {
                    await dispatch(sendMail({
                        email: values.email,
                        request_type: 3,
                        resend: 1
                    })).unwrap();

                    navigate('/otp-verification');
                } catch (error) {
                    console.log(error);
                    toast({
                        title: "Error",
                        description: error.message || "Failed to send OTP",
                        variant: "destructive"
                    });
                }
            } else {
                toast({
                    title: "Login Sucess",
                    description: res.message || "Login Success ",
                });
                navigate('/chat');
            }

        } catch (error) {
            toast({
                title: "Error",
                description: error || "Failed to send OTP",
                variant: "destructive"
            });
        }


    }
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form noValidate onSubmit={form.handleSubmit(handleLogin)}>
                            <div className="flex flex-col gap-6">
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
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel style={{ color: 'inherit' }}>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Enter password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <ReloadIcon className="h-4 w-4 animate-spin" />
                                        </div>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                                {/* <Button variant="outline" className="w-full">
                                    Login with Google
                                </Button> */}
                            </div>
                            <div className="mt-4 text-center text-sm">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className={cn(
                                        "text-primary hover:underline",
                                        isLoading && "text-muted-foreground cursor-not-allowed pointer-events-none"
                                    )}
                                    onClick={(e) => {
                                        if (isLoading) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    Sign up
                                </Link>

                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

