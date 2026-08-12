import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { LogIn, UserPlus } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5005/api";

function AuthLayout({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ flex: 1.2, background: "linear-gradient(135deg, var(--accent-color), var(--success))", display: "flex", flexDirection: "column", padding: "60px", color: "white", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "500px", height: "500px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(80px)" }}></div>
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "400px", height: "400px", background: "rgba(0,0,0,0.15)", borderRadius: "50%", filter: "blur(60px)" }}></div>
        
        <div style={{ position: "relative", zIndex: 10 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontWeight: "800", fontSize: "28px", letterSpacing: "-0.5px" }}>
            <div style={{ width: "40px", height: "40px", background: "white", color: "var(--accent-color)", borderRadius: "10px", display: "grid", placeItems: "center" }}>S</div>
            ServeDesk
          </div>
        </div>
        
        <div style={{ position: "relative", zIndex: 10, marginTop: "auto", marginBottom: "auto" }}>
          <h1 style={{ fontSize: "56px", fontWeight: "800", lineHeight: "1.1", marginBottom: "24px", letterSpacing: "-1px" }}>Transform your <br/>support workflows.</h1>
          <p style={{ fontSize: "20px", opacity: 0.9, maxWidth: "540px", lineHeight: "1.6" }}>
            Experience a unified client portal built specifically for streamlined communication, rapid troubleshooting, and absolute operational transparency.
          </p>
        </div>
        
        <div style={{ position: "relative", zIndex: 10, fontSize: "14px", opacity: 0.7, fontWeight: "500" }}>
          © 2026 ServeDesk Insight Platform.
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
        {children}
      </div>
    </div>
  );
}

export function Login({ setSession }) {
  const [email, setEmail] = useState("client@example.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem("csrmSession", JSON.stringify(data));
      setSession(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <AuthLayout>
      <div className="authCard" style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)", border: "1px solid var(--border)", width: "100%", maxWidth: "440px" }}>
        <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>Welcome Back</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "15px" }}>Sign in to your ServeDesk account</p>
        
        <form onSubmit={submit} className="authForm">
          <div className="inputGroup">
            <label style={{ fontWeight: 600 }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="inputGroup">
            <label style={{ fontWeight: 600 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          
          {error && <div className="errorMessage">{error}</div>}
          
          <button className="btn primary" style={{ width: "100%", padding:"14px", marginTop:"16px", fontSize: "15px", fontWeight: 600 }}>
            <LogIn size={18} /> Sign In
          </button>
        </form>
        
        <div style={{marginTop:"24px"}}>
          <button type="button" className="btn outline" style={{width:"100%", padding:"12px", background: "var(--bg-primary)", color: "var(--text-primary)"}} onClick={() => { setEmail("admin@example.com"); setPassword("demo123"); }}>
            Use Demo Admin Profile
          </button>
        </div>
        
        <div className="authToggle" style={{ marginTop: "32px", color: "var(--text-secondary)" }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: 600, color: "var(--accent-color)" }}>Sign up</Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export function Register({ setSession }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post(`${API}/auth/register`, { name, email, password });
      localStorage.setItem("csrmSession", JSON.stringify(data));
      setSession(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <AuthLayout>
      <div className="authCard" style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)", border: "1px solid var(--border)", width: "100%", maxWidth: "440px" }}>
        <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>Create Account</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "15px" }}>Start managing your support requests today</p>
        
        <form onSubmit={submit} className="authForm">
          <div className="inputGroup">
            <label style={{ fontWeight: 600 }}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" />
          </div>
          <div className="inputGroup">
            <label style={{ fontWeight: 600 }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@example.com" />
          </div>
          <div className="inputGroup">
            <label style={{ fontWeight: 600 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          
          {error && <div className="errorMessage">{error}</div>}
          
          <button className="btn primary" style={{ width: "100%", padding:"14px", marginTop:"16px", fontSize: "15px", fontWeight: 600 }}>
            <UserPlus size={18} /> Get Started
          </button>
        </form>
        
        <div className="authToggle" style={{ marginTop: "32px", color: "var(--text-secondary)" }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600, color: "var(--accent-color)" }}>Sign in</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
