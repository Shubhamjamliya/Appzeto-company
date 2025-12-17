const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate } = require('../../middleware/authMiddleware');
const { isVendor } = require('../../middleware/roleMiddleware');
const { getProfile, updateProfile } = require('../../controllers/vendorControllers/vendorProfileController');

// Validation rules
const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('businessName').optional().trim().isLength({ max: 100 }).withMessage('Business name must be less than 100 characters')
];

// Routes
router.get('/profile', authenticate, isVendor, getProfile);
router.put('/profile', authenticate, isVendor, updateProfileValidation, updateProfile);

module.exports = router;


