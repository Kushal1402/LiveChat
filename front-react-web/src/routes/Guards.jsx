import { selectCurrentUser, selectRequiresOTP, selectToken } from "@/store/slices/authSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

// ProtectedRoute.jsx
export const ProtectedRoute = () => {
    const user = useSelector(selectCurrentUser);
    const requiresOTP = useSelector(selectRequiresOTP);

    if (requiresOTP) {
        return <Navigate to="/otp-verification" replace />;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// OTPVerificationRoute.jsx
export const OTPVerificationRoute = () => {
    const user = useSelector(selectCurrentUser);
    const requiresOTP = useSelector(selectRequiresOTP);

    if (user) {
        return <Navigate to="/chat" replace />;
    }

    return <Outlet />
};

// AuthRoute.jsx (for login/register)
export const AuthRoute = () => {
    const user = useSelector(selectCurrentUser);
    const requiresOTP = useSelector(selectRequiresOTP);
    
    if (requiresOTP) {
        return <Navigate to="/otp-verification" replace />;
    }
    if (user) {
        return <Navigate to="/chat" replace />;
    }

    return <Outlet />;
};