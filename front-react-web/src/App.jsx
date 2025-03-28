import React, { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Login = lazy(() => import("./app/login/Login"));
const ChatWindow = lazy(() => import("./app/Chat/Page"));



function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<ChatWindow />} />

        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
