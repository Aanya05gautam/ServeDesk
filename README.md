# ServeDesk Insight Platform

![ServeDesk Hero](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200)

## Overview
**ServeDesk** is a premium, full-stack client service request system built for modern enterprise workflows. 
It replaces cluttered email chains with a unified, transparent workspace ensuring complete visibility for client operations and administrative tracking.

## 🚀 Key Features
- **Role-Based Workspaces**: Distinct dashboards tailored for Clients and Admins.
- **Real-Time Request Tracking**: Live ticket statuses (Open, In Progress, Resolved).
- **Interactive Dashboards**: Extensive KPI Analytics, recent updates feeds, and visual grids.
- **Live Notifications**: Navbar bell alerts users instantly when ticket statuses change.
- **SaaS Aesthetic UI**: Premium Slate-200 themes, split-pane authentication layouts, and intuitive modals.

## 🛠 Tech Stack
**Frontend:**
- React (Vite)
- React Router DOM
- Styled with raw CSS (No bloated frameworks)
- Lucide React Icons
- Axios for API requests

**Backend:**
- Node.js & Express
- MongoDB (Mongoose ORM)
- Multer (File Upload Handling)
- JSON Web Tokens (Sessions)

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ServeDesk.git
   ```
2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```
3. **Setup Database:**
   - Create a `.env` file in `/backend` with your `MONGO_URI`
   - Seed the database: `node seed.js`
   - Start the server: `npm run dev` (Runs on Port 5005)
4. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🔒 Demo Profiles
The database seed script sets up default interactive roles.
- **Admin**: `admin@example.com` / `demo123`
- **Employee**: `employee@example.com` / `demo123`
- **Client**: `client@example.com` / `demo123`

---
*Developed as a Summer Training Project Report Module.*
