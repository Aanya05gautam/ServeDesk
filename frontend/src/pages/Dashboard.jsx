import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { LogOut, Ticket, Users, LayoutDashboard, Plus, Search, MessageSquare, X, BookOpen, ChevronRight, Phone, Mail, Info } from "lucide-react";

const API = "http://localhost:5005/api";

function Badge({ value }) {
  const cls = value.toLowerCase().replaceAll(" ", "-");
  return <span className={`statusBadge ${cls}`}>{value}</span>;
}

export default function Dashboard({ session, setSession }) {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState(session?.user?.role === "admin" ? "overview" : "about");
  const [showNotifications, setShowNotifications] = useState(false);
  
  const headers = useMemo(() => ({ headers: { Authorization: `Bearer ${session?.token}` } }), [session]);

  const load = async () => {
    if (!session) return;
    try {
      const t = await axios.get(`${API}/tickets`, headers);
      setTickets(t.data);
      if (session.user.role === "admin") {
        const [s, e] = await Promise.all([
          axios.get(`${API}/stats`, headers),
          axios.get(`${API}/employees`, headers)
        ]);
        setStats(s.data);
        setEmployees(e.data);
      }
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, [session]);

  const logout = () => {
    localStorage.removeItem("csrmSession");
    setSession(null);
  };

  const deleteTicket = async (id) => {
    if(!window.confirm("Are you sure you want to delete this specific request?")) return;
    try {
      await axios.delete(`${API}/tickets/${id}`, headers);
      load();
    } catch (err) {
      alert("Error deleting ticket");
    }
  };

  return (
    <div className="appLayout">
      <nav className="sidebar">
        <Link to="/" className="sidebarBrand" style={{textDecoration: 'none'}}>
          <div className="sidebarBrandMark">S</div>
          <h2>ServeDesk</h2>
        </Link>
        <div className="sidebarNav">
          <span className="sidebarNavHeader">{session.user.role === "admin" ? "Admin Workspace" : "Client Workspace"}</span>
          <div className={`navLink ${activeTab==='overview'?'active':''}`} onClick={()=>setActiveTab('overview')}><LayoutDashboard size={18}/> <span>Overview</span></div>
          <div className={`navLink ${activeTab==='requests'?'active':''}`} onClick={()=>setActiveTab('requests')}><Ticket size={18}/> <span>Requests</span></div>
          {session.user.role === "admin" && <div className={`navLink ${activeTab==='users'?'active':''}`} onClick={()=>setActiveTab('users')}><Users size={18}/> <span>Team</span></div>}
          <div className={`navLink ${activeTab==='support'?'active':''}`} onClick={()=>setActiveTab('support')}><BookOpen size={18}/> <span>Support</span></div>
          <div className={`navLink ${activeTab==='about'?'active':''}`} onClick={()=>setActiveTab('about')}><Info size={18}/> <span>About</span></div>
          {session.user.role === "client" && <button className="navLink outline" onClick={() => setShowCreate(true)} style={{background:"transparent", width:"100%", justifyContent:"center"}}><Plus size={18}/> New request</button>}
        </div>
        <div className="sidebarFooter">
          <div className="sidebarUser">
            <span className="sidebarUserName">{session.user.name || session.user.email.split('@')[0]}</span>
            <span className="sidebarUserEmail">{session.user.email}</span>
          </div>
          <button className="logoutBtn" onClick={logout}><LogOut size={16}/> <span>Sign out</span></button>
        </div>
      </nav>
      
      <main className="mainContent">
        <header className="topbar" style={{ padding: "32px", paddingBottom: "0", marginBottom: "32px", borderBottom: "none", maxWidth: "1200px" }}>
          <div className="topbarHeader">
            <h1>{activeTab === 'overview' ? 'Overview' : activeTab === 'requests' ? 'My requests' : activeTab === 'support' ? 'Support Center' : activeTab === 'about' ? 'About ServeDesk' : 'Manage Team'}</h1>
            <span>{session.user.role === 'client' ? 'Client Operations' : 'Admin Operations'}</span>
          </div>
          <div className="topbarRight">
            <div className="bellIcon" style={{ position: "relative", cursor: "pointer" }} onClick={() => setShowNotifications(!showNotifications)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              {tickets.length > 0 && <div className="bellDot" style={{ position: "absolute", top: -2, right: 0, width: "8px", height: "8px", background: "var(--danger)", borderRadius: "50%" }}></div>}
              
              {showNotifications && (
                 <div style={{ position: "absolute", top: "32px", right: "0", width: "320px", background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", zIndex: 100, overflow: "hidden", textAlign: "left" }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: "600", color: "var(--text-primary)", background: "var(--bg-primary)", fontSize: "14px" }}>
                       Notifications
                    </div>
                    <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                       {tickets.slice(0,5).map(t => (
                         <div key={t.id} style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontSize: "13px", cursor: "pointer", transition: "0.2s" }} className="hoverCard" onClick={() => { setSelected(t); setShowNotifications(false); }}>
                           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                              <strong style={{ color: "var(--text-primary)" }}>{t.id} <span style={{ color: "var(--accent-color)" }}>Updated</span></strong>
                              <span style={{ color: "var(--text-secondary)", fontSize: "11px" }}>{new Date(t.createdAt).toLocaleDateString()}</span>
                           </div>
                           <div style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.4" }}>
                              {t.title.length > 40 ? t.title.substring(0, 40) + '...' : t.title}
                           </div>
                           <div style={{ marginTop: "8px" }}><Badge value={t.status}/></div>
                         </div>
                       ))}
                       {tickets.length === 0 && <div style={{ padding: "32px 20px", color: "var(--text-secondary)", fontSize: "14px", textAlign: "center" }}>You're all caught up!</div>}
                    </div>
                 </div>
              )}
            </div>
            
            <div className="userProfile">
              <div className="avatar">{(session.user.name || session.user.email).charAt(0)}</div>
              <span className="userName">{session.user.name}</span>
            </div>
          </div>
        </header>

        {/* Client Layout */}
        {session.user.role === "client" && activeTab === "overview" && (
          <div className="clientLayout" style={{ padding: "0 32px 32px", maxWidth: "1200px" }}>
            
            <div style={{ display: "flex", gap: "24px", marginBottom: "40px" }}>
              {/* Attention Banner to match screenshot */}
              <div style={{ flex: "1", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderLeft: "3px solid var(--warning)", borderRadius: "8px", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--warning)", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "16px" }}>Response Required</span>
                <strong style={{ fontSize: "56px", color: "var(--text-primary)", fontWeight: "600", lineHeight: "1", display: "block", marginBottom: "8px" }}>0</strong>
                <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Requests waiting for your response</span>
              </div>

              {/* 6-box Stats Grid */}
              <div style={{ flex: "2", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                {[
                  { label: "Open", count: tickets.filter(t=>t.status==="Open").length },
                  { label: "Assigned", count: 0 },
                  { label: "In Progress", count: tickets.filter(t=>t.status==="In Progress").length },
                  { label: "Waiting for Client", count: 0 },
                  { label: "Resolved", count: tickets.filter(t=>t.status==="Resolved").length },
                  { label: "Closed", count: 0 }
                ].map((stat, i) => (
                  <div key={i} style={{ padding: "24px", borderRight: (i % 3 !== 2) ? "1px solid var(--border)" : "none", borderBottom: (i < 3) ? "1px solid var(--border)" : "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <span style={{ color: "var(--text-secondary)", fontWeight: "600", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>{stat.label}</span>
                    <strong style={{ fontSize: "28px", color: "var(--text-primary)", fontWeight: "600", lineHeight: 1 }}>{stat.count}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Added Informational Widgets */}
            <div style={{ display: "flex", gap: "24px" }}>
              {/* Activity Feed */}
              <div style={{ flex: "2", background: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border)", padding: "24px" }}>
                <h3 style={{ fontSize: "16px", margin: "0 0 16px", color: "var(--text-primary)" }}>Recent Updates</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {tickets.slice(0, 4).map(t => (
                    <div key={t.id} style={{ display: "flex", gap: "12px", alignItems: "flex-start", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-color)", marginTop: "6px" }}></div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary)" }}>{t.title}</div>
                        <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>Ticket {t.id} • Status changed to {t.status}</div>
                      </div>
                      <div style={{ marginLeft: "auto", fontSize: "12px", color: "var(--text-secondary)" }}>
                        {new Date(t.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {tickets.length === 0 && <div style={{ color: "var(--text-secondary)", fontSize: "14px" }}>No recent activity to display.</div>}
                </div>
              </div>

              {/* Informational Cards */}
              <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ background: "linear-gradient(135deg, rgba(2,132,199,0.1), rgba(16,185,129,0.05))", borderRadius: "8px", padding: "24px", border: "1px solid var(--border)" }}>
                  <h4 style={{ margin: "0 0 8px", fontSize: "16px", color: "var(--text-primary)" }}>Need Help?</h4>
                  <p style={{ margin: "0 0 16px", fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>Access our knowledge base for quick solutions to common issues.</p>
                  <button className="btn outline" onClick={() => setActiveTab('support')} style={{ width: "100%", background: "var(--bg-primary)" }}>Visit Support Center</button>
                </div>
                
                <div style={{ background: "var(--bg-secondary)", borderRadius: "8px", padding: "24px", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)" }}></div>
                    <h4 style={{ margin: "0", fontSize: "14px", color: "var(--text-primary)" }}>System Status</h4>
                  </div>
                  <p style={{ margin: "0", fontSize: "13px", color: "var(--text-secondary)" }}>All systems are operational. No ongoing incidents reported.</p>
                </div>

                <div style={{ background: "var(--bg-secondary)", borderRadius: "8px", padding: "24px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <h4 style={{ margin: "0", fontSize: "14px", color: "var(--text-primary)" }}>Quick Actions</h4>
                  <button className="btn outline" onClick={() => setShowCreate({ type: 'bug' })} style={{ textAlign: "left", fontSize: "13px", color: "var(--text-secondary)", background: "var(--bg-primary)" }}>Submit a Bug Report</button>
                  <button className="btn outline" onClick={() => setShowCreate({ type: 'feature' })} style={{ textAlign: "left", fontSize: "13px", color: "var(--text-secondary)", background: "var(--bg-primary)" }}>Request New Feature</button>
                  <button className="btn outline" onClick={() => setActiveTab('support')} style={{ textAlign: "left", fontSize: "13px", color: "var(--text-secondary)", background: "var(--bg-primary)" }}>View User Guide</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requests Tab for Client Content */}
        {activeTab === 'requests' && (
          <div className="clientLayout" style={{ padding: "0 32px 32px", maxWidth: "1200px" }}>
            
            {/* Summary Metrics Above Table */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "32px" }}>
               <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", padding: "20px", borderRadius: "8px" }}>
                 <span style={{ fontSize: "13px", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "1px" }}>Total Lifetime Requests</span>
                 <h2 style={{ margin: "8px 0 0", fontSize: "32px", color: "var(--text-primary)" }}>{tickets.length}</h2>
               </div>
               <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", padding: "20px", borderRadius: "8px" }}>
                 <span style={{ fontSize: "13px", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "1px" }}>Open & Assigned</span>
                 <h2 style={{ margin: "8px 0 0", fontSize: "32px", color: "var(--accent-color)" }}>{tickets.filter(t => t.status === "Open" || t.status === "Assigned").length}</h2>
               </div>
               <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", padding: "20px", borderRadius: "8px" }}>
                 <span style={{ fontSize: "13px", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "1px" }}>Resolved</span>
                 <h2 style={{ margin: "8px 0 0", fontSize: "32px", color: "var(--success)" }}>{tickets.filter(t => t.status === "Resolved" || t.status === "Closed").length}</h2>
               </div>
            </div>

            {/* My Requests Table Area */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "20px", margin: "0 0 4px", color: "var(--text-primary)" }}>Request Directory</h2>
                <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Filter and manage your entire support history</span>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <select style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "white", outline: "none", color: "var(--text-primary)" }}>
                  <option>All Statuses</option>
                  <option>Open</option>
                  <option>Resolved</option>
                </select>
                <select style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "white", outline: "none", color: "var(--text-primary)" }}>
                  <option>Any Priority</option>
                  <option>High / Critical</option>
                </select>
                <button className="btn primary" onClick={() => setShowCreate(true)} style={{ padding: "10px 16px" }}>New request</button>
              </div>
            </div>

            <div className="tableContainer">
              <table>
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned to</th>
                    <th>Last updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(t => (
                    <tr key={t.id}>
                      <td><b style={{color: "var(--accent-color)"}}>{t.id}</b></td>
                      <td style={{fontWeight: 500}}>{t.title}</td>
                      <td style={{color: "var(--text-secondary)"}}>{t.category}</td>
                      <td><Badge value={t.priority}/></td>
                      <td><Badge value={t.status}/></td>
                      <td style={{color: "var(--text-secondary)"}}>Unassigned</td>
                      <td style={{color: "var(--text-secondary)"}}>{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button className="btn outline" style={{ padding: "4px 8px", fontSize: "12px", background:"white" }} onClick={() => setSelected(t)}>Open</button>
                          {session.user.role === 'client' && <button className="btn outline" style={{ padding: "4px 8px", fontSize: "12px", background:"white" }} onClick={() => setShowCreate({ modifyInfo: t })}>Modify</button>}
                          <button className="btn primary" style={{ padding: "4px 8px", fontSize: "12px", background:"var(--danger)", border:"none" }} onClick={() => deleteTicket(t.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tickets.length === 0 && <tr><td colSpan="8" style={{textAlign:"center", padding:"40px", color:"var(--text-secondary)"}}>No requests found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Support Knowledge Base Tab */}
        {activeTab === 'support' && (
          <div className="clientLayout" style={{ padding: "0 32px 32px", maxWidth: "1200px" }}>
            <div style={{ background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border)", overflow: "hidden", marginBottom: "24px" }}>
              <div style={{ padding: "32px", background: "linear-gradient(135deg, rgba(2,132,199,0.08), rgba(2,132,199,0.01))" }}>
                <h2 style={{ fontSize: "24px", margin: "0 0 8px", color: "var(--text-primary)" }}>How can we help you?</h2>
                <p style={{ margin: "0", color: "var(--text-secondary)" }}>Find answers to common questions or contact our support team directly.</p>
              </div>
              <div style={{ padding: "32px" }}>
                <h3 style={{ fontSize: "18px", margin: "0 0 20px" }}>Frequently Asked Questions</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { q: "How do I update a service request?", a: "To update an open service request, navigate to the 'Requests' tab, click on the specific ticket, and add a comment in the discussion thread. Our team will automatically be notified of your update." },
                    { q: "What is the expected response time?", a: "For High and Critical priority tickets, our SLA guarantees a response within 2 hours. Medium priority items receive responses within 1 business day." },
                    { q: "Can I escalate an urgent issue?", a: "Yes. If an issue becomes critical, please call our emergency support line below and quote your existing Ticket ID." }
                  ].map((faq, i) => (
                    <div key={i} style={{ paddingBottom: "16px", borderBottom: i !== 2 ? "1px solid var(--border)" : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "8px" }}>
                        <ChevronRight size={16} style={{ color: "var(--accent-color)" }} />
                        {faq.q}
                      </div>
                      <div style={{ paddingLeft: "24px", fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                        {faq.a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
              <div style={{ background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "rgba(2,132,199,0.1)", color: "var(--accent-color)", display: "grid", placeItems: "center" }}>
                  <Phone size={24} />
                </div>
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "16px" }}>Phone Support</h4>
                  <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>+1 (800) 555-0199</span>
                </div>
              </div>

              <div style={{ background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "rgba(16,185,129,0.1)", color: "var(--success)", display: "grid", placeItems: "center" }}>
                  <Mail size={24} />
                </div>
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "16px" }}>Email Us</h4>
                  <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>support@servedesk.com</span>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", margin: "0 0 20px" }}>Self-Service Resources</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                {[
                   { title: "Getting Started Guide", desc: "Learn the basics of the client portal." },
                   { title: "API Documentation", desc: "Integrate ServeDesk with your own internal tools." },
                   { title: "Billing & Plans", desc: "Manage your invoices and subscription tiers." }
                ].map((r, i) => (
                  <div key={i} style={{ background: "var(--bg-secondary)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border)", cursor:"pointer" }} className="hoverCard">
                     <BookOpen size={20} style={{ color: "var(--accent-color)", marginBottom: "12px" }}/>
                     <h4 style={{ margin: "0 0 8px", fontSize: "14px" }}>{r.title}</h4>
                     <p style={{ margin: "0", fontSize: "12px", color: "var(--text-secondary)" }}>{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* About Tab for Client Content */}
        {activeTab === 'about' && (
          <div className="clientLayout" style={{ padding: "0 32px 32px", maxWidth: "1200px" }}>
            <div style={{ background: "linear-gradient(135deg,rgba(2,132,199,0.8), rgba(16,185,129,0.9))", borderRadius: "16px", padding: "48px", color: "white", marginBottom: "32px", boxShadow: "0 10px 25px rgba(2,132,199,0.2)" }}>
              <h2 style={{ fontSize: "36px", margin: "0 0 16px", fontWeight: "700" }}>Welcome to ServeDesk Insight</h2>
              <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.6", maxWidth: "700px", opacity: 0.9 }}>
                ServeDesk completely transforms how businesses handle internal support and client requests. We replace cluttered inboxes and confusing forms with a straightforward workspace engineered specifically for rapid resolution.
              </p>
            </div>

            <h3 style={{ fontSize: "20px", margin: "0 0 24px", color: "var(--text-primary)" }}>How Our Request Lifecycle Works</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "40px" }}>
              {[
                { step: "01", title: "Submission", desc: "You submit a ticket. Feel free to attach error logs." },
                { step: "02", title: "Triage", desc: "Administrators immediately categorize and assign the request." },
                { step: "03", title: "Execution", desc: "Engineers process the request via real-time thread discussion." },
                { step: "04", title: "Resolution", desc: "The request is closed automatically moving to historical logs." }
              ].map((s, i) => (
                <div key={i} style={{ background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: "-10px", right: "-10px", fontSize: "80px", fontWeight: "800", opacity: "0.03", color: "var(--text-primary)" }}>{s.step}</div>
                  <span style={{ display: "inline-block", background: "rgba(2,132,199,0.1)", color: "var(--accent-color)", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", marginBottom: "16px" }}>Step {s.step}</span>
                  <h4 style={{ margin: "0 0 12px", fontSize: "16px", color: "var(--text-primary)" }}>{s.title}</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>{s.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border)", padding: "32px" }}>
              <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
                <div style={{ flex: "1" }}>
                  <h3 style={{ fontSize: "20px", margin: "0 0 12px", color: "var(--text-primary)" }}>Our Core Philosophy</h3>
                  <p style={{ margin: "0 0 16px", fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    Transparency is the backbone of service. We built ServeDesk on the core belief that you shouldn't have to guess what's holding back your project. 
                    Every update is pushed directly into this workspace, keeping technical constraints clear and progress entirely visible.
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--text-primary)", fontSize: "14px", lineHeight: "1.8" }}>
                    <li><strong>Guaranteed Visibility</strong>: Live statuses on every ticket.</li>
                    <li><strong>Universal History</strong>: No ticket is ever wiped, giving you full audit logs.</li>
                    <li><strong>Unified Communication</strong>: Single-channel chat strictly confined to the issue context.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {session.user.role === "admin" && activeTab === 'overview' && (
          <div className="overviewTab">
            <div style={{ background: "linear-gradient(135deg, var(--bg-tertiary), rgba(2,132,199,0.05))", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 10px 30px rgba(2,132,199,0.05)" }}>
              <div>
                <h2 style={{ fontSize: "28px", margin: "0 0 10px", color: "var(--text-primary)" }}>Admin Dashboard 👋</h2>
                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "16px" }}>You have <strong>{stats?.openTickets || 0}</strong> active requests across all operations.</p>
              </div>
            </div>
            
            {stats && (
              <div className="statsGrid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "40px" }}>
                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", padding: "24px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                  <span style={{ color: "var(--text-secondary)", fontWeight: "600", textTransform: "uppercase", fontSize: "13px" }}>Total Tickets</span>
                  <strong style={{ fontSize: "40px", color: "var(--text-primary)", fontWeight: "800", lineHeight: 1 }}>{stats.totalTickets}</strong>
                </div>
                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", padding: "24px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                  <span style={{ color: "var(--text-secondary)", fontWeight: "600", textTransform: "uppercase", fontSize: "13px" }}>Open Tickets</span>
                  <strong style={{ fontSize: "40px", color: "var(--warning)", fontWeight: "800", lineHeight: 1 }}>{stats.openTickets}</strong>
                </div>
                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", padding: "24px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                  <span style={{ color: "var(--text-secondary)", fontWeight: "600", textTransform: "uppercase", fontSize: "13px" }}>Total Clients & Employees</span>
                  <strong style={{ fontSize: "40px", color: "var(--accent-color)", fontWeight: "800", lineHeight: 1 }}>{stats.totalClients + stats.totalEmployees}</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Removed duplicate requests table */}
        {activeTab === 'users' && (
          <div style={{marginTop: "40px", padding: "40px", textAlign: "center", background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "8px"}}>
            <p>Team management module coming soon.</p>
          </div>
        )}
      </main>

      {showCreate && <CreateModal headers={headers} preset={showCreate} onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); load(); }}/>}
      {selected && <TicketModal ticket={selected} session={session} headers={headers} employees={employees} onClose={() => setSelected(null)} onChanged={() => { setSelected(null); load(); }}/>}
    </div>
  );
}

function CreateModal({ headers, preset, onClose, onCreated }) {
  const isBug = preset?.type === 'bug';
  const isFeature = preset?.type === 'feature';
  const modifyInfo = preset?.modifyInfo;

  const [form, setForm] = useState({ 
    title: modifyInfo ? modifyInfo.title : isBug ? "[Bug] " : isFeature ? "[Feature] " : "", 
    description: modifyInfo ? modifyInfo.description : "", 
    category: modifyInfo ? modifyInfo.category : isBug ? "Technical Support" : isFeature ? "Website Issue" : "Technical Support", 
    priority: modifyInfo ? modifyInfo.priority : "Medium" 
  });
  const [file, setFile] = useState(null);
  
  async function submit(e) {
    e.preventDefault();
    try {
      if (modifyInfo) {
         await axios.put(`${API}/tickets/${modifyInfo.id}`, form, headers);
         onCreated();
         return;
      }
      
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("category", form.category);
      data.append("priority", form.priority);
      if (file) data.append("attachment", file);

      await axios.post(`${API}/tickets`, data, { 
        headers: { 
          ...headers.headers, 
          'Content-Type': 'multipart/form-data' 
        }
      }); 
      onCreated(); 
    } catch (err) { alert(err.response?.data?.message || "Error"); }
  }
  
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={e=>e.stopPropagation()}>
        <div className="modalHeader"><h2>{preset?.modifyInfo ? "Modify Request" : isBug ? "Submit Bug Report" : isFeature ? "Request New Feature" : "New Request"}</h2><button className="btnIcon" onClick={onClose}><X/></button></div>
        <form onSubmit={submit} className="authForm" style={{gap:"12px"}}>
          <div className="inputGroup"><label>Title</label><input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Short summary" /></div>
          <div className="inputGroup"><label>Description</label><textarea required rows="4" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Full details..." /></div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px"}}>
            <div className="inputGroup"><label>Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{["Technical Support","Website Issue","Account Issue","Billing"].map(x=><option key={x}>{x}</option>)}</select></div>
            <div className="inputGroup"><label>Priority</label><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>{["Low","Medium","High","Critical"].map(x=><option key={x}>{x}</option>)}</select></div>
          </div>
          {!preset?.modifyInfo && (
          <div className="inputGroup">
            <label>Attachment (Optional)</label>
            <input type="file" onChange={e=>setFile(e.target.files[0])} style={{padding:"8px"}} />
          </div>
          )}
          <button className="btn primary" style={{marginTop:"10px"}}>{preset?.modifyInfo ? "Save Changes" : "Create Ticket"}</button>
        </form>
      </div>
    </div>
  );
}

function TicketModal({ ticket, session, headers, employees, onClose, onChanged }) {
  const [comment, setComment] = useState("");
  
  async function status(status) { await axios.patch(`${API}/tickets/${ticket.id}/status`, { status }, headers); onChanged(); }
  async function assign(employeeId) { await axios.patch(`${API}/tickets/${ticket.id}/assign`, { employeeId }, headers); onChanged(); }
  
  async function addComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    await axios.post(`${API}/tickets/${ticket.id}/comments`, { message: comment }, headers);
    setComment(""); 
    onChanged();
  }
  
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={e=>e.stopPropagation()}>
        <div className="modalHeader">
          <div style={{display:"flex", alignItems:"center", gap:"12px"}}><h2>{ticket.id}</h2><Badge value={ticket.status}/></div>
          <button className="btnIcon" onClick={onClose}><X/></button>
        </div>
        
        <h3 style={{margin:"0 0 10px"}}>{ticket.title}</h3>
        <p style={{color:"var(--text-secondary)", margin:0, lineHeight:1.5}}>{ticket.description}</p>
        
        <div className="detailGrid">
          <div><span>Category</span><b>{ticket.category}</b></div>
          <div><span>Priority</span><b><Badge value={ticket.priority}/></b></div>
          <div><span>Created On</span><b>{new Date(ticket.createdAt).toLocaleDateString()}</b></div>
        </div>
        
        {ticket.attachment && (
          <div style={{marginBottom: "20px"}}>
            <a href={`http://localhost:5000${ticket.attachment}`} target="_blank" rel="noreferrer" className="btn secondary" style={{fontSize: "12px", border:"1px solid var(--border)"}}>
              View Attachment
            </a>
          </div>
        )}
        
        {session.user.role === "admin" && (
          <div className="inputGroup" style={{marginBottom:"16px"}}>
            <label>Assign to Team Member</label>
            <select value={ticket.assignedTo || ""} onChange={e=>assign(e.target.value)}>
              <option value="">Unassigned</option>
              {employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
        )}
        
        {(session.user.role === "admin" || session.user.role === "employee") && (
          <div className="statusActions">
            {["Assigned","In Progress","Waiting for Client","Resolved","Closed"].map(s=><button key={s} className="btn secondary" onClick={()=>status(s)}>{s}</button>)}
          </div>
        )}
        
        <div className="comments">
          <h3 style={{display:"flex", alignItems:"center", gap:"8px", margin:"0 0 16px"}}><MessageSquare size={16}/> Conversation History</h3>
          {ticket.comments.map(c=>(
            <div className="comment" key={c.id}>
              <b>{c.user}</b><span>{new Date(c.createdAt).toLocaleDateString()}</span>
              <p>{c.message}</p>
            </div>
          ))}
          {ticket.comments.length === 0 && <p style={{color:"var(--text-secondary)"}}>No comments yet.</p>}
          
          <form onSubmit={addComment} className="commentForm">
            <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Type a message..." style={{flex:1, background:"rgba(0,0,0,0.2)", border:"1px solid var(--border)", color:"white", padding:"12px", borderRadius:"8px"}} />
            <button className="btn primary">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
