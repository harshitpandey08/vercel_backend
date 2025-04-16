const mongoose = require('mongoose');

const petSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a pet name'],
    },
    species: {
      type: String,
      required: [true, 'Please specify the species'],
    },
    breed: {
      type: String,
    },
    description: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unknown'],
      default: 'unknown',
    },
    size: {
      type: String,
    },
    health: {
      type: String,
    },
    age: {
      type: String,
    },
    temperament: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pet', petSchema);
