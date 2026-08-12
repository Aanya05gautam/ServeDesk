const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["admin", "employee", "client"] }
});
const User = mongoose.model("User", UserSchema);

const CommentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  user: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: String, required: true }
});

const TicketSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, required: true },
  clientId: { type: String, required: true },
  assignedTo: { type: String, default: null },
  status: { type: String, default: "Open" },
  attachment: { type: String, default: null },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  comments: [CommentSchema]
});
const Ticket = mongoose.model("Ticket", TicketSchema);

const SessionSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "24h" }
});
const Session = mongoose.model("Session", SessionSchema);

module.exports = { connectDB, User, Ticket, Session };
