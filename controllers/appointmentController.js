const Appointment = require('../models/appointmentModel');

const createAppointment = async (req, res) => {
  try {
    const { pet, type, date, time, notes } = req.body;

    const appointment = await Appointment.create({
      pet,
      owner: req.user._id,
      type,
      date,
      time,
      notes,
      status: 'pending',
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === 'pet_owner') {
      // Pet owners see their own appointments
      appointments = await Appointment.find({ owner: req.user._id })
        .populate('pet', 'name species breed image')
        .populate('veterinarian', 'firstName lastName');
    } else if (req.user.role === 'veterinarian') {
      // Veterinarians see appointments assigned to them
      appointments = await Appointment.find({ veterinarian: req.user._id })
        .populate('pet', 'name species breed image')
        .populate('owner', 'firstName lastName');
    }

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('pet', 'name species breed image')
      .populate('owner', 'firstName lastName')
      .populate('veterinarian', 'firstName lastName');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the appointment belongs to the user or is assigned to the veterinarian
    if (
      appointment.owner.toString() !== req.user._id.toString() &&
      (appointment.veterinarian && appointment.veterinarian._id.toString() !== req.user._id.toString())
    ) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the appointment belongs to the user or is assigned to the veterinarian
    if (
      appointment.owner.toString() !== req.user._id.toString() &&
      (appointment.veterinarian && appointment.veterinarian.toString() !== req.user._id.toString())
    ) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('pet', 'name species breed image')
      .populate('owner', 'firstName lastName')
      .populate('veterinarian', 'firstName lastName');

    res.json(updatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the appointment belongs to the user
    if (appointment.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await appointment.remove();

    res.json({ message: 'Appointment removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};

