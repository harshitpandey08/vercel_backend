const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Pet',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    veterinarian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      required: [true, 'Please specify appointment type'],
      enum: ['check-up', 'vaccination', 'grooming', 'surgery', 'other'],
    },
    date: {
      type: Date,
      required: [true, 'Please specify appointment date'],
    },
    time: {
      type: String,
      required: [true, 'Please specify appointment time'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
