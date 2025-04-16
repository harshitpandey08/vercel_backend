const HealthRecord = require("../models/healthRecordModel");
const Pet = require("../models/petModel");

// @desc    Add a health record
// @route   POST /api/health-records
// @access  Private
const addHealthRecord = async (req, res) => {
  try {
    const { pet, recordType, date, value, notes } = req.body;

    // Check if pet exists and belongs to the user or the user is a veterinarian
    const petExists = await Pet.findById(pet);
    if (!petExists) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (
      petExists.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "veterinarian"
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const healthRecord = await HealthRecord.create({
      pet,
      recordType,
      date: date || Date.now(),
      value,
      notes,
      recordedBy: req.user._id,
    });

    res.status(201).json(healthRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all health records for a pet
// @route   GET /api/health-records/:petId
// @access  Private
const getHealthRecords = async (req, res) => {
  try {
    const { petId } = req.params;

    // Check if pet exists and belongs to the user or the user is a veterinarian
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (
      pet.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "veterinarian"
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const healthRecords = await HealthRecord.find({ pet: petId })
      .populate("recordedBy", "firstName lastName role")
      .sort({ date: -1 });

    res.json(healthRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get a health record by ID
// @route   GET /api/health-records/:id
// @access  Private
const getHealthRecordById = async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findById(req.params.id).populate(
      "recordedBy",
      "firstName lastName role"
    );

    if (!healthRecord) {
      return res.status(404).json({ message: "Health record not found" });
    }

    // Check if the health record belongs to a pet owned by the user or the user is a veterinarian
    const pet = await Pet.findById(healthRecord.pet);
    if (
      pet.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "veterinarian"
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(healthRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a health record
// @route   PUT /api/health-records/:id
// @access  Private
const updateHealthRecord = async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findById(req.params.id);

    if (!healthRecord) {
      return res.status(404).json({ message: "Health record not found" });
    }

    // Check if the health record was recorded by the user or the user is a veterinarian
    if (
      healthRecord.recordedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "veterinarian"
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedHealthRecord = await HealthRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("recordedBy", "firstName lastName role");

    res.json(updatedHealthRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a health record
// @route   DELETE /api/health-records/:id
// @access  Private
const deleteHealthRecord = async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findById(req.params.id);

    if (!healthRecord) {
      return res.status(404).json({ message: "Health record not found" });
    }

    // Check if the health record was recorded by the user
    if (healthRecord.recordedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await healthRecord.remove();

    res.json({ message: "Health record removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get health statistics for a pet
// @route   GET /api/health-records/stats/:petId
// @access  Private
const getHealthStats = async (req, res) => {
  try {
    const { petId } = req.params;

    // Check if pet exists and belongs to the user or the user is a veterinarian
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (
      pet.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "veterinarian"
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Get all health records for the pet
    const healthRecords = await HealthRecord.find({ pet: petId }).sort({
      date: 1,
    });

    // Calculate statistics
    const stats = {
      weight: "25%", // Placeholder values
      nutrition: "70%",
      activity: "52%",
      records: healthRecords,
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addHealthRecord,
  getHealthRecords,
  getHealthRecordById,
  updateHealthRecord,
  deleteHealthRecord,
  getHealthStats,
};
