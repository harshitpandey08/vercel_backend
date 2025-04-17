const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();
connectDB();

const app = express();

// Define CORS options once
const corsOptions = {
  origin: 'https://vercel-frontend-tan.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware ONCE (not twice like before)
app.use(cors(corsOptions));
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

// module.exports = app;
app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});