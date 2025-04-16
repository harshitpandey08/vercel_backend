const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB().catch((err) => {
  console.error("MongoDB connection error:", err.message);
});

// Route files
const userRoutes = require("./routes/userRoutes");
const petRoutes = require("./routes/petRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
// These route imports have been removed as they're not used by the frontend
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Body parser
app.use(express.json());

// Enable CORS with specific options for Vercel deployment
app.use(cors());

// Add OPTIONS handling for preflight requests
app.options("*", cors());

// Add custom headers for additional CORS support
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Mount routers
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/appointments", appointmentRoutes);
// These routes have been removed as they're not used by the frontend
app.use("/api/dashboard", dashboardRoutes);

// Basic routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Pet Vet API" });
});

// Health check endpoint for Vercel
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
