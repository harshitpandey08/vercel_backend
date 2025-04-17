const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();
connectDB();

const app = express();

// Handle CORS
app.use((req, res, next) => {
  // Set CORS headers directly
  res.setHeader('Access-Control-Allow-Origin', 'https://vercel-frontend-rose.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Regular middleware
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
const petRoutes = require("./routes/petRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const messageRoutes = require("./routes/messageRoutes");
const healthRecordRoutes = require("./routes/healthRecordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/health-records", healthRecordRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Pet Vet API" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});