const express = require("express");
const serverless = require("serverless-http");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("../config/db");

// Load env vars
dotenv.config();
connectDB();

const app = express();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000", // for local development
  "https://vercel-frontend-tan.vercel.app", // your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Preflight request handling
app.options("*", cors());

// Routes
const userRoutes = require("../routes/userRoutes");
const petRoutes = require("../routes/petRoutes");
const appointmentRoutes = require("../routes/appointmentRoutes");
const messageRoutes = require("../routes/messageRoutes");
const healthRecordRoutes = require("../routes/healthRecordRoutes");
const dashboardRoutes = require("../routes/dashboardRoutes");

app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/health-records", healthRecordRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Pet Vet API" });
});

// Fallback route for undefined endpoints
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports.handler = serverless(app);
