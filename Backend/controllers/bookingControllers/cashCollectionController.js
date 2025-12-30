const Booking = require('../../models/Booking');
const Vendor = require('../../models/Vendor');
const Transaction = require('../../models/Transaction');
const { PAYMENT_STATUS } = require('../../utils/constants');

/**
 * Initiate Cash Collection
 * Optional: Sends OTP to customer
 */
exports.initiateCashCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.paymentMethod !== 'cash' && booking.paymentMethod !== 'pay_at_home') {
      return res.status(400).json({ success: false, message: 'This booking is not a cash payment' });
    }

    // Optional: Update final total and extra items if provided during initiation
    const { totalAmount, extraItems } = req.body;
    if (totalAmount !== undefined) {
      booking.finalAmount = Number(totalAmount);
    }
    if (extraItems && Array.isArray(extraItems)) {
      booking.workDoneDetails = {
        ...booking.workDoneDetails,
        items: extraItems.map(item => ({
          title: item.title,
          qty: Number(item.qty) || 1,
          price: Number(item.price) || 0
        }))
      };
    }

    // Force mark modified for nested object if needed
    if (extraItems) booking.markModified('workDoneDetails');

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    booking.customerConfirmationOTP = otp;
    await booking.save();

    // In a real app, send OTP via SMS here
    console.log(`Cash Collection OTP for booking ${booking.bookingNumber}: ${otp}. Total: ${booking.finalAmount}`);

    res.status(200).json({
      success: true,
      message: 'OTP initiated',
      totalAmount: booking.finalAmount,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined // Return OTP only in dev
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Confirm Cash Collection (by Vendor/Worker)
 */
exports.confirmCashCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp, amount, extraItems } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // OTP Verification (if provided)
    if (booking.customerConfirmationOTP && otp && booking.customerConfirmationOTP !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const collectionAmount = amount || booking.finalAmount;

    // Optional: Update items if provided again
    if (extraItems && Array.isArray(extraItems)) {
      booking.workDoneDetails = {
        ...booking.workDoneDetails,
        items: extraItems.map(item => ({
          title: item.title,
          qty: item.qty || 1,
          price: item.price
        }))
      };
      booking.finalAmount = collectionAmount;
    }

    // Update Booking
    booking.cashCollected = true;
    booking.cashCollectedAt = new Date();
    booking.cashCollectedBy = userRole === 'vendor' ? 'vendor' : 'worker';
    booking.cashCollectorId = userId;
    booking.paymentStatus = PAYMENT_STATUS.COLLECTED_BY_VENDOR;

    // If it was a self-job or completed by worker, mark booking as completed or work_done?
    // Usually cash collection is the last step for cash bookings.
    if (booking.status === 'work_done' || booking.status === 'visited' || booking.status === 'in_progress') {
      booking.status = 'completed';
      booking.completedAt = new Date();
    }

    await booking.save();

    // Update Vendor Wallet (Even if worker collected, it goes to vendor's ledger)
    const vendorId = booking.vendorId;
    const vendor = await Vendor.findById(vendorId);

    if (vendor) {
      // Decrease balance (negative balance means owes admin)
      vendor.wallet.balance -= collectionAmount;
      vendor.wallet.totalCashCollected += collectionAmount;

      // Check cash limit
      if (Math.abs(vendor.wallet.balance) > vendor.wallet.cashLimit) {
        vendor.wallet.isBlocked = true;
        vendor.wallet.blockedAt = new Date();
        vendor.wallet.blockReason = 'Cash collection limit exceeded. Please settle dues with admin.';
      }

      await vendor.save();

      // Record Transaction
      await Transaction.create({
        vendorId,
        bookingId: booking._id,
        amount: -collectionAmount,
        type: 'cash_collected',
        description: `Cash collected for booking ${booking.bookingNumber}`,
        status: 'completed'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cash collection confirmed and recorded in ledger',
      data: {
        bookingId: booking._id,
        amount: collectionAmount,
        walletBalance: vendor?.wallet?.balance
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Customer Confirm Payment (Optional flow for user to confirm they paid)
 */
exports.customerConfirmPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.customerConfirmed = true;
    await booking.save();

    res.status(200).json({ success: true, message: 'Payment confirmed by customer' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Cash Collection Status
 */
exports.getCashCollectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).select('cashCollected cashCollectedAt cashCollectedBy paymentStatus');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
