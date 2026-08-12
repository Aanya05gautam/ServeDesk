require("dotenv").config();
const { connectDB, User, Ticket, Session } = require("./db");
const mongoose = require("mongoose");

const seedDatabase = async () => {
  await connectDB();
  
  try {
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Session.deleteMany({});
    
    console.log("Database cleared");
    
    const users = [
      { id: "u1", name: "Admin User", email: "admin@example.com", password: "demo123", role: "admin" },
      { id: "u2", name: "Rahul Sharma", email: "employee@example.com", password: "demo123", role: "employee" },
      { id: "u3", name: "Demo Client", email: "client@example.com", password: "demo123", role: "client" }
    ];
    
    await User.insertMany(users);
    console.log("Users seeded successfully");
    
    const tickets = [
      {
        id: "SR-2026-0001",
        title: "Payment gateway not working",
        description: "The payment page returns an error when a customer tries to complete checkout.",
        category: "Technical Support",
        priority: "High",
        clientId: "u3",
        assignedTo: "u2",
        status: "In Progress",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [{ id: "c1", user: "Rahul Sharma", message: "I am investigating the payment configuration.", createdAt: new Date().toISOString() }]
      },
      {
        id: "SR-2026-0002",
        title: "Request account update",
        description: "Please update the billing contact information for our account.",
        category: "Account Issue",
        priority: "Medium",
        clientId: "u3",
        assignedTo: null,
        status: "Open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: []
      }
    ];
    
    await Ticket.insertMany(tickets);
    console.log("Tickets seeded successfully");
    
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed");
  }
};

seedDatabase();
