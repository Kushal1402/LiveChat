import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp"
import { useLocation, useNavigate } from "react-router"
import { register, sendMail, verifyOTP } from "@/store/slices/authSlice"
import { useDispatch } from "react-redux"


const OTPVerification = () => {
  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(10)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [otpToken, setOtpToken] = useState(null)
  const { toast } = useToast()
  const dispatch = useDispatch()

  const location = useLocation()
  console.log(location);

  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    if (otp.length === 6) {
      dispatch(verifyOTP({
        token: otpToken || location.state.token,
        otp,
        request_type: location.state.type,
        email : location.state.email
      }))
        .unwrap()
        .then((res) => {
          console.log(res);
          setIsSubmitting
          toast({
            title: "Success",
            description: res?.message,
            variant: "default",
          })
          dispatch(register(
            location.state
          )).unwrap()
            .then((res) => {
              console.log(res);
              setIsSubmitting
            })

        })
        .catch((error) => {
          console.log(error);
          setIsSubmitting
          toast({
            title: "Error",
            description: error || "Something went wrong. Please try again.",
            variant: "destructive",
          });
        });
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      })
    }
    setIsSubmitting(false)

  }

  // Handle resend OTP
  const handleResend = () => {
    setTimeLeft(60)
    setOtp("")

    dispatch(sendMail({
      email: location.state.email,
      request_type: 1,
      resend: 2
    }))
      .unwrap()
      .then((res) => {
        setOtpToken(res?.token)
        toast({
          title: "Mail Re-Send !",
          description: res?.message,
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      });
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
              disabled={otp.length !== 6 || isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
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