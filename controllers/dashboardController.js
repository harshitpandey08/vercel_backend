const Pet = require('../models/petModel');
const Appointment = require('../models/appointmentModel');


const getDashboardData = async (req, res) => {
  try {
    // Get user's pets
    const pets = await Pet.find({ owner: req.user._id });

    // Get upcoming appointments and format them for the dashboard
    let appointments = [];
    let pendingAppointments = 0;

    if (req.user.role === 'pet_owner') {
      const appointmentData = await Appointment.find({ owner: req.user._id })
        .populate('pet', 'name species breed image')
        .populate('veterinarian', 'firstName lastName')
        .sort({ date: 1 })
        .limit(5);

      // Count pending appointments
      pendingAppointments = await Appointment.countDocuments({
        owner: req.user._id,
        status: 'pending'
      });

      // Format appointments for frontend
      appointments = appointmentData.map(appointment => ({
        id: appointment._id,
        name: appointment.pet.name,
        type: appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1),
        date: new Date(appointment.date).toLocaleDateString() + ' ' + appointment.time,
        veterinar: appointment.veterinarian
          ? `${appointment.veterinarian.firstName} ${appointment.veterinarian.lastName}`
          : 'Find veterinar'
      }));
    } else if (req.user.role === 'veterinarian') {
      const appointmentData = await Appointment.find({ veterinarian: req.user._id })
        .populate('pet', 'name species breed image')
        .populate('owner', 'firstName lastName')
        .sort({ date: 1 })
        .limit(5);

      // Count pending appointments
      pendingAppointments = await Appointment.countDocuments({
        veterinarian: req.user._id,
        status: 'pending'
      });

      // Format appointments for frontend
      appointments = appointmentData.map(appointment => ({
        id: appointment._id,
        name: appointment.pet.name,
        type: appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1),
        date: new Date(appointment.date).toLocaleDateString() + ' ' + appointment.time,
        owner: `${appointment.owner.firstName} ${appointment.owner.lastName}`
      }));
    }

    // Sample chat messages for the dashboard
    const chatMessages = [
      {
        id: 1,
        name: 'Pet Vet Support',
        message: 'Welcome to Pet Vet! How can we help you today?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: 0
      }
    ];

    // Sample unread messages count
    const unreadMessagesCount = 0;

    // Sample health records
    const healthRecords = [];

    // Get health data for charts
    const healthData = [
      { month: 'Jan', value: 3 },
      { month: 'Feb', value: 4 },
      { month: 'Mar', value: 5 },
      { month: 'Apr', value: 4 },
      { month: 'May', value: 6 },
      { month: 'Jun', value: 7 },
      { month: 'Jul', value: 8 },
      { month: 'Aug', value: 7 },
      { month: 'Sep', value: 6 },
      { month: 'Oct', value: 8 },
      { month: 'Nov', value: 9 },
      { month: 'Dec', value: 8 },
    ];

    const activityPercentage = 75;
    const sleepPercentage = 68;
    const wellnessPercentage = 82;

    res.json({
      pets,
      appointments,
      pendingAppointments,
      healthRecords,
      unreadMessagesCount,
      chatMessages,
      healthData,
      activityPercentage,
      sleepPercentage,
      wellnessPercentage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDashboardData,
};
