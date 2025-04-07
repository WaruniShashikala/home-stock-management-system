const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authController.getProfile);
router.patch('/profile', authController.updateProfile);
router.post('/logout', authController.logout);

// Admin-only routes
router.get('/admin/users', authController.getAllUsers);
router.patch('/admin/users/:id', authController.adminUpdateUser);
router.delete('/admin/users/:id', authController.adminDeleteUser);

module.exports = router;