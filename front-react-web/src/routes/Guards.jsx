import { selectCurrentUser, selectRequiresOTP } from "@/store/slices/authSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

// Protected route component
export const ProtectedRoute = () => {
    const user = useSelector(selectCurrentUser);
    const requiresOTP = useSelector(selectRequiresOTP);

    if (requiresOTP) {
        return <Navigate to="/otp-verification" replace />;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// OTP verification route protector
export const OTPVerificationRoute = () => {
    const requiresOTP = useSelector(selectRequiresOTP);
    const user = useSelector(selectCurrentUser);

    if (!requiresOTP && !user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

// Auth route protector (for login/register when logged in)
export const AuthRoute = () => {
    const user = useSelector(selectCurrentUser);

    return user ? <Navigate to="/chat" replace /> : <Outlet />;
};