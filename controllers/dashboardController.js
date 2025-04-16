const Pet = require("../models/petModel");
const Appointment = require("../models/appointmentModel");

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    // Get user's pets
    const pets = await Pet.find({ owner: req.user._id });

    // Get upcoming appointments
    let appointments;
    if (req.user.role === "pet_owner") {
      appointments = await Appointment.find({ owner: req.user._id })
        .populate("pet", "name species breed image")
        .populate("veterinarian", "firstName lastName")
        .sort({ date: 1 })
        .limit(5);
    } else if (req.user.role === "veterinarian") {
      appointments = await Appointment.find({ veterinarian: req.user._id })
        .populate("pet", "name species breed image")
        .populate("owner", "firstName lastName")
        .sort({ date: 1 })
        .limit(5);
    }

    // Sample health records (since we removed the HealthRecord model)
    const healthRecords = [];

    // Sample unread messages count (since we removed the Message model)
    const unreadMessagesCount = 0;

    // Get sample chat data for the dashboard
    const chatData = [
      {
        id: 1,
        sender: "System",
        message: "Welcome to Pet Vet! How can we help you today?",
        timestamp: new Date(),
      },
      {
        id: 2,
        sender: "System",
        message: "You can use this chat to communicate with veterinarians.",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      },
      {
        id: 3,
        sender: "System",
        message: "Need help? Just ask!",
        timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      },
    ];

    // Get activity history data for charts
    const activityHistory = [
      { month: "Jan", value: 30 },
      { month: "Feb", value: 40 },
      { month: "Mar", value: 45 },
      { month: "Apr", value: 35 },
      { month: "May", value: 55 },
      { month: "Jun", value: 60 },
      { month: "Jul", value: 65 },
      { month: "Aug", value: 70 },
      { month: "Sep", value: 75 },
      { month: "Oct", value: 80 },
      { month: "Nov", value: 85 },
      { month: "Dec", value: 90 },
    ];

    // Get health stats
    const healthStats = {
      weight: "25%",
      nutrition: "70%",
      activity: "52%",
    };

    // Format the response to match what the frontend expects
    res.json({
      pets,
      appointments,
      healthRecords,
      unreadMessagesCount,
      chatMessages: chatData.map((item) => ({
        id: item.id,
        name: item.sender,
        message: item.message,
        time: new Date(item.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        unread: 0,
      })),
      healthData: activityHistory,
      activityPercentage: parseInt(healthStats.activity),
      sleepPercentage: 68,
      wellnessPercentage: 82,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getDashboardData,
};
