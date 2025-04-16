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
const messageRoutes = require("./routes/messageRoutes");
const healthRecordRoutes = require("./routes/healthRecordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/health-records", healthRecordRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Pet Vet API" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
