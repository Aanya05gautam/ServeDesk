import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import { Login, Register } from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import "./styles.css";

export default function App() {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem("csrmSession") || "null"));

  return (
    <>
      <div className="bgOrbs">
        <div className="bgOrb bgOrb1"></div>
        <div className="bgOrb bgOrb2"></div>
        <div className="bgOrb bgOrb3"></div>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={session ? <Dashboard session={session} setSession={setSession} /> : <Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={!session ? <Login setSession={setSession} /> : <Navigate to="/" />} />
          <Route path="/register" element={!session ? <Register setSession={setSession} /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
