import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp"
import { useNavigate } from "react-router"
import { register, sendMail, verifyOTP } from "@/store/slices/authSlice"
import { useDispatch, useSelector } from "react-redux"
import {
  selectFlowType,
  selectTempEmail,
  selectTempUserData,
  selectTempToken,
  selectIsVerifyingOTP
} from "@/store/slices/authSlice";

const OTPVerification = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()

  const flowType = useSelector(selectFlowType);
  const tempEmail = useSelector(selectTempEmail);
  const tempUserData = useSelector(selectTempUserData);
  const tempToken = useSelector(selectTempToken);
  const isVerifyingOtp = useSelector(selectIsVerifyingOTP)

  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(10)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Verify OTP
      await dispatch(verifyOTP({
        otp,
        token: tempToken,
        email: tempEmail,
        request_type: flowType === 'register' ? 1 : 3,
      })).unwrap();

      // Handle flow-specific logic
      if (flowType === 'register') {
        await dispatch(register(tempUserData)).unwrap();
      }

      navigate('/chat');
    } catch (error) {
      toast({
        title: "Error",
        description: error || "Failed to send OTP",
        variant: "destructive"
      });
    }

  }

  // Handle resend OTP
  const handleResend = async () => {
    setTimeLeft(60)
    setOtp("")
    try {
      const payload = {
        email: tempEmail,
        request_type: flowType === 'register' ? 1 : 3,
        resend: 2
      };

      await dispatch(sendMail(payload)).unwrap();
      setTimeLeft(60);
    } catch (error) {
      // Handle error
    }

  }

  // Countdown timer
  useEffect(() => {
    if (timeLeft === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
          <p className="text-sm text-center text-gray-500">
            Enter the 6-digit code sent to your email
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                {/* First group of 3 digits */}
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="h-14 w-14 text-xl" />
                  <InputOTPSlot index={1} className="h-14 w-14 text-xl" />
                  <InputOTPSlot index={2} className="h-14 w-14 text-xl" />
                </InputOTPGroup>

                {/* Visual separator (dash) */}
                <span className="mx-2 text-2xl font-bold text-gray-400">-</span>

                {/* Second group of 3 digits */}
                <InputOTPGroup>
                  <InputOTPSlot index={3} className="h-14 w-14 text-xl" />
                  <InputOTPSlot index={4} className="h-14 w-14 text-xl" />
                  <InputOTPSlot index={5} className="h-14 w-14 text-xl" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={otp.length !== 6 || isVerifyingOtp}
            >
              {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {timeLeft > 0 ? (
                <p>Resend code in {timeLeft} second{timeLeft !== 1 ? 's' : ''}</p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-primary font-medium hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default OTPVerification