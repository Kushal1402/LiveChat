import React, { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Login = lazy(() => import("./app/login/Login"));


function App() {  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
