import React, { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster"
import { AuthRoute, OTPVerificationRoute, ProtectedRoute } from "./routes/Guards";
import { useSelector } from "react-redux";
import { SocketProvider } from "./context/SocketContext";

import LoadingScreen from "./components/ui/LoadingScreen";

const Login = lazy(() => import("./app/login/Login"));
const ChatWindow = lazy(() => import("./app/Chat/Page"));
const OTPVerification = lazy(() => import("./app/login/OTPVerification"));
const RegisterForm = lazy(() => import("./app/login/RegisterForm"));
const ForgotPassword = lazy(() => import("./app/login/ForgotPassword"));
const ResetPassword = lazy(() => import("./app/login/ResetPassword"));

function App() {
  const { token } = useSelector((state) => state.auth)
  return (
    <>
      <Toaster />
      <SocketProvider token={token}>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route element={<AuthRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>

              <Route element={<OTPVerificationRoute />}>
                <Route path="/otp-verification" element={<OTPVerification />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/chat" element={<ChatWindow />} />
              </Route>

              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SocketProvider>
    </>
  )
}

export default App
