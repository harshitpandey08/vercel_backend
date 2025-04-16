const Pet = require("../models/petModel");
const User = require("../models/userModel");

// @desc    Add a new pet
// @route   POST /api/pets
// @access  Private
const addPet = async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      description,
      gender,
      size,
      health,
      age,
      temperament,
      image,
    } = req.body;

    const pet = await Pet.create({
      owner: req.user._id,
      name,
      species,
      breed,
      description,
      gender,
      size,
      health,
      age,
      temperament,
      image,
    });

    // Update user's onboarding step to 2 (completed step 2) if they're a pet owner
    if (req.user.role === "pet_owner") {
      await User.findByIdAndUpdate(req.user._id, { onboardingStep: 2 });
    }

    res.status(201).json(pet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all pets for a user
// @route   GET /api/pets
// @access  Private
const getPets = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user._id });
    res.json(pets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get a pet by ID
// @route   GET /api/pets/:id
// @access  Private
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Check if the pet belongs to the user
    if (
      pet.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "veterinarian"
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(pet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a pet
// @route   PUT /api/pets/:id
// @access  Private
const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Check if the pet belongs to the user
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedPet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a pet
// @route   DELETE /api/pets/:id
// @access  Private
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Check if the pet belongs to the user
    if (pet.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await pet.remove();

    res.json({ message: "Pet removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
};
