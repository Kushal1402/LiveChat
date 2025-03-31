import React, { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"
import { AuthRoute, OTPVerificationRoute, ProtectedRoute } from "./routes/Guards";

const Login = lazy(() => import("./app/login/Login"));
const ChatWindow = lazy(() => import("./app/Chat/Page"));
const OTPVerification = lazy(() => import("./app/login/OTPVerification"));
const RegisterForm = lazy(() => import("./app/login/RegisterForm"));

function App() {

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route element={<AuthRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterForm />} />
          </Route>

          <Route element={<OTPVerificationRoute />}>
            <Route path="/otp-verification" element={<OTPVerification />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<ChatWindow />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
