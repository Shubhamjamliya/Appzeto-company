const mongoose = require('mongoose');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../utils/constants');

/**
 * Booking Model
 * Represents service bookings made by users
 */
const bookingSchema = new mongoose.Schema({
  // Unique Booking Number
  bookingNumber: {
    type: String,
    unique: true,
    required: true
  },
  // User Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  // Vendor Information
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: false, // Optional initially, assigned when vendor accepts
    index: true
  },
  // Track vendors notified about this booking
  notifiedVendors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  }],
  // Worker Information (optional - assigned later)
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    default: null,
    index: true
  },
  // Service Information
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required'],
    index: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
    index: true
  },
  // Service Details (snapshot at booking time)
  serviceName: {
    type: String,
    required: true
  },
  serviceCategory: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  serviceImages: [{
    type: String
  }],
  // Booked Items - Matches Service catalog structure
  // Structure: Section > Card (specific service selected)
  bookedItems: [{
    // Section info (from service.sections[])
    sectionTitle: {
      type: String,
      default: 'General'
    },
    sectionId: {
      type: String
    },
    // Card info (specific item from section.cards[])
    card: {
      title: {
        type: String
      },
      subtitle: {
        type: String
      },
      price: {
        type: Number,
        default: 0
      },
      originalPrice: {
        type: Number
      },
      duration: {
        type: String
      },
      description: {
        type: String
      },
      imageUrl: {
        type: String
      },
      features: [{
        type: String
      }]
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  // Booking Status
  status: {
    type: String,
    enum: Object.values(BOOKING_STATUS),
    default: BOOKING_STATUS.PENDING,
    index: true
  },
  workerResponse: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING'
  },
  workerAcceptedAt: {
    type: Date
  },
  // Pricing Information
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  visitingCharges: {
    type: Number,
    default: 0,
    min: [0, 'Visiting charges cannot be negative']
  },
  finalAmount: {
    type: Number,
    required: [true, 'Final amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  adminCommission: {
    type: Number,
    default: 0
  },
  vendorEarnings: {
    type: Number,
    default: 0
  },
  // Payment Information
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING,
    index: true
  },
  paymentMethod: {
    type: String, // 'wallet', 'razorpay', 'cash', 'card'
    default: null
  },
  paymentId: {
    type: String, // Razorpay payment ID or transaction ID
    default: null
  },
  razorpayOrderId: {
    type: String,
    default: null,
    index: true
  },
  razorpayPaymentId: {
    type: String,
    default: null
  },
  // Address Information
  address: {
    type: {
      type: String, // 'home', 'work', 'other'
      default: 'home'
    },
    addressLine1: {
      type: String,
      required: [true, 'Address line 1 is required']
    },
    addressLine2: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required']
    },
    landmark: {
      type: String,
      default: ''
    },
    lat: {
      type: Number,
      default: null
    },
    lng: {
      type: Number,
      default: null
    }
  },
  // Scheduling Information
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required'],
    index: true
  },
  scheduledTime: {
    type: String, // e.g., "10:00 AM - 12:00 PM"
    required: [true, 'Scheduled time is required']
  },
  timeSlot: {
    start: {
      type: String, // e.g., "10:00"
      required: true
    },
    end: {
      type: String, // e.g., "12:00"
      required: true
    }
  },
  // Completion Information
  completedAt: {
    type: Date,
    default: null
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  cancellationReason: {
    type: String,
    default: null
  },
  cancelledBy: {
    type: String, // 'user', 'vendor', 'worker', 'admin'
    default: null
  },
  workPhotos: [{
    type: String // Cloudinary URLs
  }],
  // Review & Rating (after completion)
  rating: {
    type: Number,
    default: null,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    default: null
  },
  reviewImages: [{
    type: String
  }],
  reviewedAt: {
    type: Date,
    default: null
  },
  // Additional Notes
  // userNotes and isPlusAdded removed per request
  vendorNotes: {
    type: String,
    default: null
  },
  workerNotes: {
    type: String,
    default: null
  },
  // Tracking
  acceptedAt: {
    type: Date,
    default: null
  },
  assignedAt: {
    type: Date,
    default: null
  },
  startedAt: {
    type: Date,
    default: null
  },
  journeyStartedAt: {
    type: Date,
    default: null
  },
  visitedAt: {
    type: Date,
    default: null
  },
  visitOtp: {
    type: String,
    select: false // Secure field, not returned by default
  },
  paymentOtp: {
    type: String,
    select: false // Secure field
  },
  visitLocation: {
    lat: Number,
    lng: Number,
    address: String,
    verifiedAt: Date
  },
  workDoneDetails: {
    description: String,
    items: [{
      title: String,
      qty: Number,
      price: Number
    }]
  },
  // Additional Status Tracking
  workerPaymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'SUCCESS'],
    default: 'PENDING'
  },
  isWorkerPaid: {
    type: Boolean,
    default: false
  },
  workerPaidAt: {
    type: Date,
    default: null
  },
  finalSettlementStatus: {
    type: String,
    enum: ['PENDING', 'DONE'],
    default: 'PENDING'
  },
  // Cash Collection Tracking
  cashCollected: {
    type: Boolean,
    default: false
  },
  cashCollectedAt: {
    type: Date,
    default: null
  },
  cashCollectedBy: {
    type: String,
    enum: ['vendor', 'worker'],
    default: null
  },
  cashCollectorId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'cashCollectedBy',
    default: null
  },
  customerConfirmed: {
    type: Boolean,
    default: false
  },
  customerConfirmationOTP: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Generate unique booking number before saving
bookingSchema.pre('save', async function (next) {
  if (this.isNew && !this.bookingNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.bookingNumber = `BK${timestamp}${random}`;
  }
  next();
});

// Indexes for faster queries
bookingSchema.index({ userId: 1, status: 1, createdAt: -1 });
bookingSchema.index({ vendorId: 1, status: 1, createdAt: -1 });
bookingSchema.index({ workerId: 1, status: 1, createdAt: -1 });
bookingSchema.index({ scheduledDate: 1, status: 1 });
bookingSchema.index({ paymentStatus: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

