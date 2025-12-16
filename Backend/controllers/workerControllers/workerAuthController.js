const Worker = require('../../models/Worker');
const { createOTPToken, verifyOTPToken, markTokenAsUsed } = require('../../services/otpService');
const { generateTokenPair } = require('../../utils/tokenService');
const { TOKEN_TYPES, USER_ROLES } = require('../../utils/constants');
const { validationResult } = require('express-validator');

/**
 * Send OTP for worker registration/login
 */
const sendOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { phone, email } = req.body;

    const existingWorker = await Worker.findOne({ phone });

    const { token, otp } = await createOTPToken({
      userId: existingWorker ? existingWorker._id : null,
      phone,
      email: email || null,
      type: TOKEN_TYPES.PHONE_VERIFICATION,
      expiryMinutes: 10
    });

    console.log(`OTP for worker ${phone}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      token
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
};

/**
 * Register worker with OTP and Aadhar
 */
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, aadhar, otp, token } = req.body;

    // Verify OTP
    const verification = await verifyOTPToken({ phone, otp, type: TOKEN_TYPES.PHONE_VERIFICATION });
    if (!verification.success) {
      return res.status(400).json({
        success: false,
        message: verification.message
      });
    }

    if (verification.tokenDoc.token !== token) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    // Check if worker already exists
    const existingWorker = await Worker.findOne({ $or: [{ phone }, { email }] });
    if (existingWorker) {
      return res.status(400).json({
        success: false,
        message: 'Worker already exists. Please login.'
      });
    }

    // Upload Aadhar document (assuming base64 or URL)
    const aadharDoc = req.body.aadharDocument || null;
    // TODO: Upload to Cloudinary if it's a file

    // Create worker
    const worker = await Worker.create({
      name,
      email,
      phone,
      aadhar: {
        number: aadhar,
        document: aadharDoc // In production, use uploaded URL
      },
      isPhoneVerified: true
    });

    // Mark token as used
    await markTokenAsUsed(verification.tokenDoc._id);

    // Generate JWT tokens
    const tokens = generateTokenPair({
      userId: worker._id,
      role: USER_ROLES.WORKER
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
        phone: worker.phone
      },
      ...tokens
    });
  } catch (error) {
    console.error('Worker registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
};

/**
 * Login worker with OTP
 */
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { phone, otp, token } = req.body;

    // Verify OTP
    const verification = await verifyOTPToken({ phone, otp, type: TOKEN_TYPES.PHONE_VERIFICATION });
    if (!verification.success) {
      return res.status(400).json({
        success: false,
        message: verification.message
      });
    }

    if (verification.tokenDoc.token !== token) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    // Find worker
    const worker = await Worker.findOne({ phone });
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found. Please sign up first.'
      });
    }

    if (!worker.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Mark token as used
    await markTokenAsUsed(verification.tokenDoc._id);

    // Generate JWT tokens
    const tokens = generateTokenPair({
      userId: worker._id,
      role: USER_ROLES.WORKER
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
        phone: worker.phone
      },
      ...tokens
    });
  } catch (error) {
    console.error('Worker login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

/**
 * Logout worker
 */
const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

module.exports = {
  sendOTP,
  register,
  login,
  logout
};

