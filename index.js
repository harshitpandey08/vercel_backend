const express = require("express");
const serverless = require("serverless-http");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();
connectDB();

const app = express();

// ✅ CORS setup
app.use(cors({
  origin: "https://vercel-frontend-tan.vercel.app", // allow your frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

// ✅ Manual headers (just to be safe)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://vercel-frontend-tan.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

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

module.exports = app;
module.exports.handler = serverless(app);
