const User = require('../models/userModel');

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if all required fields are provided
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: 'Please provide all required fields',
        missingFields: {
          firstName: !firstName,
          lastName: !lastName,
          email: !email,
          password: !password
        }
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role: role || 'pet_owner', // Default to pet_owner if role is not provided
    };

    const user = await User.create(userData);

    if (user) {
      const responseData = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        onboardingStep: user.onboardingStep,
        token: user.getSignedJwtToken(),
      };

      res.status(201).json(responseData);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password',
        missingFields: {
          email: !email,
          password: !password
        }
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const responseData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      location: user.location,
      profileImage: user.profileImage,
      onboardingStep: user.onboardingStep,
      token: user.getSignedJwtToken(),
    };
    res.json(responseData);
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        location: user.location,
        profileImage: user.profileImage,
        onboardingStep: user.onboardingStep,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.location = req.body.location || user.location;
      user.profileImage = req.body.profileImage || user.profileImage;

      // Update onboarding step if provided
      if (req.body.onboardingStep !== undefined) {
        user.onboardingStep = req.body.onboardingStep;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        location: updatedUser.location,
        profileImage: updatedUser.profileImage,
        onboardingStep: updatedUser.onboardingStep,
        token: updatedUser.getSignedJwtToken(),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const completeOnboardingStep1 = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, location, profileImage } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.location = location || user.location;
      user.profileImage = profileImage || user.profileImage;

      // Set onboarding step to 1 (completed step 1)
      user.onboardingStep = 1;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        location: updatedUser.location,
        profileImage: updatedUser.profileImage,
        onboardingStep: updatedUser.onboardingStep,
        token: updatedUser.getSignedJwtToken(),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  completeOnboardingStep1,
};
