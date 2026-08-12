import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Users, Code } from "lucide-react";

export default function About() {
  return (
    <div className="landingPage">
      <nav className="landingNav">
        <Link to="/" className="brand" style={{textDecoration: 'none'}}>
          <div className="brandMark">S</div>
          <h2>ServiceDesk</h2>
        </Link>
        <Link to="/" className="btn secondary"><ArrowLeft size={18}/> Back to Home</Link>
      </nav>
      
      <main className="hero" style={{paddingTop:"60px", paddingBottom:"100px", textAlign:"center", maxWidth: "1200px"}}>
        <div style={{maxWidth: "800px", margin: "0 auto", marginBottom: "60px"}}>
          <div className="pill" style={{marginBottom: "20px"}}>🚀 Empowering Support Teams</div>
          <h1 style={{fontSize:"54px", fontWeight: "800", marginBottom:"24px", color:"var(--text-primary)", lineHeight: 1.1}}>
            Built for teams who <span style={{color: "var(--accent-color)"}}>truly care</span> about their clients.
          </h1>
          <p style={{fontSize:"20px", lineHeight:1.6, color:"var(--text-secondary)"}}>
            ServiceDesk is a minimal, blazing fast, and highly secure Client Service Request Management (CSRM) system. 
            We bridge the gap between clients needing technical support and the dedicated employees resolving their issues.
          </p>
        </div>

        {/* Fake Informational Metrics */}
        <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "80px"}}>
          <div style={{background: "var(--bg-secondary)", border: "1px solid var(--border)", padding: "32px", borderRadius: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)"}}>
            <h2 style={{fontSize: "48px", fontWeight: "800", color: "var(--accent-color)", margin: "0 0 10px"}}>99.9%</h2>
            <p style={{margin: 0, fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase"}}>Uptime Reliability</p>
          </div>
          <div style={{background: "var(--bg-secondary)", border: "1px solid var(--border)", padding: "32px", borderRadius: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)"}}>
            <h2 style={{fontSize: "48px", fontWeight: "800", color: "var(--accent-color)", margin: "0 0 10px"}}>50k+</h2>
            <p style={{margin: 0, fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase"}}>Tickets Resolved</p>
          </div>
          <div style={{background: "var(--bg-secondary)", border: "1px solid var(--border)", padding: "32px", borderRadius: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)"}}>
            <h2 style={{fontSize: "48px", fontWeight: "800", color: "var(--accent-color)", margin: "0 0 10px"}}>&lt; 2m</h2>
            <p style={{margin: 0, fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase"}}>Average Response</p>
          </div>
        </div>
        
        <h2 style={{fontSize:"36px", color:"var(--text-primary)", marginBottom:"40px", fontWeight: "700"}}>Our Core Pillars</h2>
        
        <div style={{display:"grid", gridTemplateColumns: "repeat(3, 1fr)", gap:"32px", textAlign: "left"}}>
          <div className="featureCard">
            <Zap size={32} style={{color: "var(--accent-color)", marginBottom: "20px"}} />
            <h3 style={{fontSize:"22px", color:"var(--text-primary)", margin:"0 0 12px"}}>Simplicity First</h3>
            <p style={{margin:0, color:"var(--text-secondary)", lineHeight:1.6}}>No tangled menus, no bloatware. A clean UI designed to help you focus on the solution, not learning the tool.</p>
          </div>
          <div className="featureCard">
            <Users size={32} style={{color: "var(--accent-color)", marginBottom: "20px"}} />
            <h3 style={{fontSize:"22px", color:"var(--text-primary)", margin:"0 0 12px"}}>Frictionless Experience</h3>
            <p style={{margin:0, color:"var(--text-secondary)", lineHeight:1.6}}>Clients can seamlessly submit tickets in seconds, while employees handle them using real-time instantly updated statuses.</p>
          </div>
          <div className="featureCard">
            <Code size={32} style={{color: "var(--accent-color)", marginBottom: "20px"}} />
            <h3 style={{fontSize:"22px", color:"var(--text-primary)", margin:"0 0 12px"}}>Premium Architecture</h3>
            <p style={{margin:0, color:"var(--text-secondary)", lineHeight:1.6}}>Fully capable OAuth structure, deeply integrated with robust MongoDB storage, and constructed with cutting-edge React standards.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
