import React from "react";
import { Link } from "react-router-dom";
import { Zap, Briefcase, Shield, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="landingPage">
      <nav className="landingNav">
        <Link to="/" className="brand" style={{textDecoration: 'none'}}>
          <div className="brandMark">S</div>
          <h2>ServiceDesk</h2>
        </Link>
        <div className="navLinks" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Home Page</Link>
          <Link to="/about" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>About</Link>
          <div className="navActions" style={{ display: 'flex', gap: '12px' }}>
            <Link to="/login" className="btn primary">Login / Sign Up</Link>
          </div>
        </div>
      </nav>
      <main className="hero">
        <div className="heroLayout" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '40px', alignItems: 'center', textAlign: 'left', padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="heroText">
            <div className="pill" style={{ marginBottom: '24px' }}>✨ Fast & Reliable Support</div>
            <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: 1.1, margin: '0 0 24px', color: 'var(--text-primary)' }}>
              Client support that feels <span style={{ color: 'var(--accent-color)' }}>magical.</span>
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
              ServiceDesk brings your team and clients together in one beautifully streamlined platform. Handle requests faster and build better relationships.
            </p>
            <div className="heroButtons">
              <Link to="/login" className="btn primary large" style={{ display: 'inline-flex', padding: '16px 32px', fontSize: '18px' }}>Login / Sign Up <ArrowRight size={20}/></Link>
            </div>
          </div>
          
          <div className="heroVisual" style={{ perspective: '1000px' }}>
            <div className="mockupWindow" style={{ transform: 'rotateY(-10deg) rotateX(5deg) scale(1.05)', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 20px 50px rgba(236,72,153,0.15), 0 0 0 4px rgba(255,255,255,0.5)', transition: 'transform 0.5s ease' }}>
              <div style={{ display: 'flex', gap: '8px', padding: '16px', background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
              </div>
              <div style={{ padding: '24px', display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ height: '80px', flex: 1, background: 'var(--bg-tertiary)', borderRadius: '8px' }}></div>
                  <div style={{ height: '80px', flex: 1, background: 'var(--bg-tertiary)', borderRadius: '8px' }}></div>
                  <div style={{ height: '80px', flex: 1, background: 'var(--bg-tertiary)', borderRadius: '8px' }}></div>
                </div>
                <div style={{ height: '200px', width: '100%', background: 'linear-gradient(135deg, rgba(2,132,199,0.05), rgba(14,165,233,0.05))', borderRadius: '8px', border: '1px solid var(--border)' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="featuresGrid" style={{ marginTop: '40px' }}>
          <div className="featureCard">
            <Zap className="featureIcon" size={32} />
            <h3>Lightning Fast</h3>
            <p>Our dashboard operates in real-time, allowing your support team to resolve issues much faster.</p>
          </div>
          <div className="featureCard">
            <Briefcase className="featureIcon" size={32} />
            <h3>Premium Experience</h3>
            <p>A brilliant design that instills trust and showcases your brand's commitment to incredible quality.</p>
          </div>
          <div className="featureCard">
            <Shield className="featureIcon" size={32} />
            <h3>Secure & Reliable</h3>
            <p>Your client data is protected by enterprise-grade security and robust database architectures.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
