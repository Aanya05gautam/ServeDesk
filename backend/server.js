require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { OAuth2Client } = require("google-auth-library");
const { connectDB, User, Ticket, Session } = require("./db");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = process.env.VERCEL ? "/tmp" : path.join(__dirname, "uploads");
try {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
} catch (err) {
  console.log("Could not create uploads dir (likely Serverless environment)");
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });
app.use("/uploads", express.static(uploadDir));

connectDB();

async function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const session = await Session.findOne({ token });
    if (!session) return res.status(401).json({ message: "Invalid session" });

    const user = await User.findOne({ id: session.userId });
    if (!user) return res.status(401).json({ message: "Invalid session" });

    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

function role(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}

app.get("/", (_, res) => res.json({ message: "CSRM API is running" }));

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });
    
    const token = crypto.randomBytes(24).toString("hex");
    await Session.create({ token, userId: user.id });
    
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", detail: error.message || error.toString() });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });
    
    const id = `u${Date.now()}`;
    user = await User.create({ id, name, email, password, role: "client" });
    
    const token = crypto.randomBytes(24).toString("hex");
    await Session.create({ token, userId: user.id });
    
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { email, name, sub } = payload;
    
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        id: `g${sub}`,
        name,
        email,
        password: crypto.randomBytes(16).toString("hex"),
        role: "client"
      });
    }
    
    const token = crypto.randomBytes(24).toString("hex");
    await Session.create({ token, userId: user.id });
    
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid Google Token" });
  }
});

app.get("/api/auth/me", auth, (req, res) => res.json({ user: req.user }));

app.get("/api/tickets", auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "client") query = { clientId: req.user.id };
    if (req.user.role === "employee") query = { assignedTo: req.user.id };
    
    // Sort by createdAt descending to show newest first
    const tickets = await Ticket.find(query).sort({ _id: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/tickets", auth, role("client"), upload.single("attachment"), async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    if (!title || !description || !category || !priority) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const count = await Ticket.countDocuments();
    const ticketId = `SR-2026-${String(count + 1).padStart(4, "0")}`;
    
    let attachmentUrl = null;
    if (req.file) {
      attachmentUrl = `/uploads/${req.file.filename}`;
    }
    
    const ticket = await Ticket.create({
      id: ticketId,
      title, description, category, priority,
      attachment: attachmentUrl,
      clientId: req.user.id,
      assignedTo: null,
      status: "Open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    });
    
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.patch("/api/tickets/:id/assign", auth, role("admin"), async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ id: req.params.id });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    
    ticket.assignedTo = req.body.employeeId || null;
    ticket.status = ticket.assignedTo ? "Assigned" : "Open";
    ticket.updatedAt = new Date().toISOString();
    
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.patch("/api/tickets/:id/status", auth, role("admin", "employee"), async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ id: req.params.id });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    
    ticket.status = req.body.status;
    ticket.updatedAt = new Date().toISOString();
    
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/tickets/:id", auth, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ id: req.params.id });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    
    if (req.user.role === "client" && ticket.clientId !== req.user.id) {
       return res.status(403).json({ message: "Forbidden" });
    }
    
    ticket.title = req.body.title || ticket.title;
    ticket.description = req.body.description || ticket.description;
    ticket.category = req.body.category || ticket.category;
    ticket.priority = req.body.priority || ticket.priority;
    ticket.updatedAt = new Date().toISOString();
    
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/tickets/:id", auth, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ id: req.params.id });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    
    if (req.user.role === "client" && ticket.clientId !== req.user.id) {
       return res.status(403).json({ message: "Forbidden" });
    }
    
    await Ticket.deleteOne({ id: req.params.id });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/tickets/:id/comments", auth, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ id: req.params.id });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (!req.body.message?.trim()) return res.status(400).json({ message: "Comment is required" });
    
    const comment = {
      id: crypto.randomUUID(),
      user: req.user.name,
      message: req.body.message.trim(),
      createdAt: new Date().toISOString()
    };
    
    ticket.comments.push(comment);
    ticket.updatedAt = new Date().toISOString();
    
    await ticket.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/employees", auth, role("admin"), async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }, 'id name email');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/stats", auth, role("admin"), async (req, res) => {
  try {
    const total = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ status: "Open" });
    const inProgress = await Ticket.countDocuments({ status: "In Progress" });
    const resolved = await Ticket.countDocuments({ status: { $in: ["Resolved", "Closed"] } });
    const critical = await Ticket.countDocuments({ priority: "Critical" });
    
    res.json({ total, open, inProgress, resolved, critical });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5005;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`CSRM backend running at http://localhost:${PORT}`));
}

module.exports = app;
