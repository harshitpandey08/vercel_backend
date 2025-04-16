const mongoose = require('mongoose');

const healthRecordSchema = mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Pet',
    },
    recordType: {
      type: String,
      required: [true, 'Please specify record type'],
      enum: ['weight', 'vaccination', 'medication', 'allergy', 'condition', 'other'],
    },
    date: {
      type: Date,
      required: [true, 'Please specify record date'],
      default: Date.now,
    },
    value: {
      type: String,
    },
    notes: {
      type: String,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
