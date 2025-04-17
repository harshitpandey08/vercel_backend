const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();
connectDB();

const app = express();

// ✅ CORS setup
// On your backend
const corsOptions = { 
  origin : '*',
  // origin: process.env.CLIENT_URL || "https://vercel-frontend-tan.vercel.app",
  // methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  // allowedHeaders: ["Content-Type", "Authorization"],
  // credentials: true,
  optionsSuccessStatus: 200
}; 

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
app.listen(process.env.PORT,()=>{
  console.log(`server is running on port ${process.env.PORT}`)
})
