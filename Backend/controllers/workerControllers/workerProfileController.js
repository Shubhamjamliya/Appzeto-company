const Worker = require('../../models/Worker');
const { validationResult } = require('express-validator');

/**
 * Get worker profile
 */
const getProfile = async (req, res) => {
  try {
    const workerId = req.user.id;

    const worker = await Worker.findById(workerId).select('-password -__v');

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    res.status(200).json({
      success: true,
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        serviceCategory: worker.serviceCategory || '',
        skills: worker.skills || [],
        address: worker.address || null,
        rating: worker.rating || 0,
        totalJobs: worker.totalJobs || 0,
        completedJobs: worker.completedJobs || 0,
        status: worker.status,
        profilePhoto: worker.profilePhoto || null,
        isPhoneVerified: worker.isPhoneVerified || false,
        isEmailVerified: worker.isEmailVerified || false,
        createdAt: worker.createdAt,
        updatedAt: worker.updatedAt
      }
    });
  } catch (error) {
    console.error('Get worker profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile. Please try again.'
    });
  }
};

/**
 * Update worker profile
 */
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const workerId = req.user.id;
    const { name, serviceCategory, skills, address } = req.body;

    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    // Update fields
    if (name) worker.name = name.trim();
    if (serviceCategory) worker.serviceCategory = serviceCategory.trim();
    if (skills && Array.isArray(skills)) worker.skills = skills;
    if (address) {
      worker.address = {
        addressLine1: address.addressLine1 || worker.address?.addressLine1 || '',
        addressLine2: address.addressLine2 || worker.address?.addressLine2 || '',
        city: address.city || worker.address?.city || '',
        state: address.state || worker.address?.state || '',
        pincode: address.pincode || worker.address?.pincode || '',
        landmark: address.landmark || worker.address?.landmark || ''
      };
    }

    await worker.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        serviceCategory: worker.serviceCategory,
        skills: worker.skills,
        address: worker.address,
        rating: worker.rating,
        totalJobs: worker.totalJobs,
        completedJobs: worker.completedJobs,
        status: worker.status,
        isPhoneVerified: worker.isPhoneVerified,
        isEmailVerified: worker.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Update worker profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile. Please try again.'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};

