const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { VENDOR_STATUS } = require('../utils/constants');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    select: false
  },
  businessName: {
    type: String,
    trim: true
  },
  service: {
    type: String,
    required: [true, 'Please provide a service category']
  },
  aadhar: {
    number: {
      type: String,
      required: [true, 'Please provide Aadhar number'],
      trim: true
    },
    document: {
      type: String, // Cloudinary URL
      required: [true, 'Please upload Aadhar document']
    }
  },
  pan: {
    number: {
      type: String,
      required: [true, 'Please provide PAN number'],
      trim: true,
      uppercase: true
    },
    document: {
      type: String, // Cloudinary URL
      required: [true, 'Please upload PAN document']
    }
  },
  otherDocuments: [{
    type: String // Cloudinary URLs
  }],
  approvalStatus: {
    type: String,
    enum: Object.values(VENDOR_STATUS),
    default: VENDOR_STATUS.PENDING
  },
  approvalDate: {
    type: Date
  },
  rejectedReason: {
    type: String
  },
  profilePhoto: {
    type: String,
    default: null
  },
  address: {
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  wallet: {
    balance: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
vendorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
vendorSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Vendor', vendorSchema);

