import React, { useState, useEffect } from 'react'
import { Card, CardFooter, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2 } from 'lucide-react'
import { z } from "zod";
import { useSelector } from 'react-redux'
import { selectFlowType, selectIsSendingMail, selectIsUpdatingMail, selectIsVerifyingOTP, selectTempToken, sendMail, setFlowType, updateEmail, verifyOTP } from '@/store/slices/authSlice'
import { dispatch } from '@/store/store'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'

const emailSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})


const AccountTab = () => {

    const { toast } = useToast()
    const tempToken = useSelector(selectTempToken)
    const isSendingOtp = useSelector(selectIsSendingMail)
    const isVerifyingOtp = useSelector(selectIsVerifyingOTP)
    const isUpdatingEmail = useSelector(selectIsUpdatingMail)
    const flowType = useSelector(selectFlowType)

    const [isOTPOpen, setIsOTPOpen] = useState(false)
    const [otp, setOtp] = useState('')
    const [timeLeft, setTimeLeft] = useState(5)
    const [otpError, setOtpError] = useState('')


    useEffect(() => {
        if (isOTPOpen) {
            setOtp('')
            setOtpError('')
            setTimeLeft(5)
        }
    }, [isOTPOpen])

    useEffect(() => {
        if (timeLeft > 0 && isOTPOpen) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [timeLeft, isOTPOpen])

    async function handleSendOtp(values) {
        dispatch(setFlowType('update-mail'))
        try {
            const res = await dispatch(sendMail({
                email: values.email,
                request_type: 4,
                resend: 1
            })).unwrap()
            toast({
                title: "Opt Sent ! ",
                description: res?.message || "Otp Send Succesfully",
            });
            handleOpenOTP();
        } catch (error) {
            toast({
                title: "Error",
                description: error || "Failed to Sent Otp TryAgain",
                variant: "destructive"
            });
        }
    }
    const handleVerifyOTP = async () => {
        setOtpError('')
        const email = getValues("email");
        const payload = {
            otp,
            token: tempToken,
            email,
            request_type: 4
        }
        try {
            await dispatch(verifyOTP(payload)).unwrap()
            if (flowType === 'update-mail') {
                const payload = {
                    email,
                    token: "asasas",
                    otp
                }
                try {
                    const res = await dispatch(updateEmail(payload)).unwrap();
                    setIsOTPOpen(false)
                    console.log(res?.data?.message);
                    toast({
                        title: "Updated ! ",
                        description: res?.data?.message || "Email Updated Succesfully",
                    });
                } catch (error) {
                    handleCloseOTP()
                    toast({
                        title: "Failed !",
                        description: error || "Failed to update Email",
                        variant: "destructive"
                    });
                }

            }
        } catch (error) {
            setOtpError(error)
            console.log(err);
            // throw new Error(error)

        }
    }
    const handleCloseOTP = () => {
        setIsOTPOpen(false)
    }
    const handleOpenOTP = () => {
        setIsOTPOpen(true)

    }

    const handleResendOTP = async () => {
        setOtpError('')
        const email = getValues("email");
        dispatch(setFlowType('update-mail'))
        try {
            const res = await dispatch(sendMail({
                email,
                request_type: 4,
                resend: 1
            })).unwrap()
            setTimeLeft(30)
            // toast({
            //     title: "Opt Sent ! ",
            //     description: res?.message || "Otp Send Succesfully",
            // });
            handleOpenOTP();
        } catch (error) {
            console.log(error);

            // toast({
            //     title: "Error",
            //     description: error || "Failed to Sent Otp TryAgain",
            //     variant: "destructive"
            // });
        }
    }


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues
    } = useForm({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "" // Initial email value
        }
    })



    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Email Address</CardTitle>
                    <CardDescription>
                        Update your email address. You'll need to verify any new email address.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(handleSendOtp)}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !!errors.email || isSendingOtp}
                        >
                            {isSendingOtp ? (<>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>) : ('Update Email')}
                        </Button>
                    </CardFooter>
                </form>
            </Card>


            {/* OTP Dialog */}
            <Dialog open={isOTPOpen} onOpenChange={handleCloseOTP}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Verify Your Identity</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-muted-foreground text-center">
                            Enter the 6-digit code sent to your email
                        </p>

                        <div className="flex justify-center">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={(value) => {
                                    setOtp(value)
                                    setOtpError('')
                                }}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} className="h-14 w-14 text-xl" />
                                    <InputOTPSlot index={1} className="h-14 w-14 text-xl" />
                                    <InputOTPSlot index={2} className="h-14 w-14 text-xl" />
                                </InputOTPGroup>

                                <span className="mx-2 text-2xl font-bold text-gray-400">-</span>

                                <InputOTPGroup>
                                    <InputOTPSlot index={3} className="h-14 w-14 text-xl" />
                                    <InputOTPSlot index={4} className="h-14 w-14 text-xl" />
                                    <InputOTPSlot index={5} className="h-14 w-14 text-xl" />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        {otpError && (
                            <p className="text-center text-sm font-medium text-destructive">
                                {otpError}
                            </p>
                        )}

                        <Button
                            onClick={handleVerifyOTP}
                            disabled={otp.length !== 6 || isVerifyingOtp || isUpdatingEmail}
                            className="w-full"
                        >
                            {

                                isUpdatingEmail
                                    ? (<>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>)
                                    : isVerifyingOtp
                                        ? (<>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Verifing...
                                        </>) :
                                        ('Verify OTP')
                            }
                        </Button>

                        <div className="text-center text-sm">
                            {timeLeft > 0 ? (
                                <span className="text-muted-foreground">
                                    Resend code in {timeLeft}s
                                </span>
                            ) : (
                                <Button
                                    variant="link"
                                    onClick={handleResendOTP}
                                    disabled={isSendingOtp}
                                    className="h-auto p-0 text-sm"
                                >
                                    {isSendingOtp ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Resend OTP'
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default AccountTab