import React, { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"

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
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/chat" element={<ChatWindow />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
