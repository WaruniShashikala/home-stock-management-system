const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, profilePicture } = req.body;
    
    const user = new User({
      username,
      email,
      password,
      role: role || 'user',
      profilePicture: profilePicture || ''
    });

    await user.save();
    
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    
    res.status(201).send({ 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }, 
      token 
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    
    res.send({ 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }, 
      token 
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.send({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, profilePicture } = req.body;
    console.log(req.body)
    // Find the user by ID from authenticated request
    const user = await User.findById(req.body._id);
    
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Update only allowed fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    // Return updated user without sensitive data
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture
    };

    res.send(userResponse);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).send({ 
      error: error.message || 'Failed to update profile' 
    });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    res.send({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Admin-only: Get all users
exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find({}, { password: 0 }); // Exclude passwords
      res.send(users);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };
  
  // Admin-only: Update any user
  exports.adminUpdateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = Object.keys(req.body);
      const allowedUpdates = ['username', 'email', 'role', 'profilePicture'];
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
      if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
      }
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
  
      updates.forEach(update => user[update] = req.body[update]);
      await user.save();
  
      // Return user without password
      const userObj = user.toObject();
      delete userObj.password;
      res.send(userObj);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };
  
  // Admin-only: Delete user
  exports.adminDeleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
  
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
  
      res.send({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };