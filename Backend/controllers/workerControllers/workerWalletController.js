const Worker = require('../../models/Worker');
const Transaction = require('../../models/Transaction');
const Booking = require('../../models/Booking');
const Notification = require('../../models/Notification');

/**
 * Get worker wallet with ledger balance
 */
const getWallet = async (req, res) => {
  try {
    const workerId = req.user.id;
    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    // List of bookings pending payment
    const pendingBookings = await Booking.find({
      workerId: workerId,
      status: 'completed', // Only completed jobs
      workerPaymentStatus: 'PENDING'
    })
      .select('bookingNumber serviceName completedAt vendorId vendorEarnings')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        balance: worker.wallet?.balance || 0,
        pendingBookings: pendingBookings
      }
    });

  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch wallet info' });
  }
};

/**
 * Get worker transactions
 */
const getTransactions = async (req, res) => {
  try {
    const workerId = req.user.id;
    const { page = 1, limit = 20, type } = req.query;

    const query = { workerId };

    // Filter by type if provided
    if (type && type !== 'all') {
      query.type = type;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
};

const { sendPushNotification } = require('../../services/firebaseAdmin');

/**
 * Request payout from vendor for a specific booking
 */
const requestPayout = async (req, res) => {
  try {
    const workerId = req.user.id;
    const { bookingId } = req.body;
    const worker = await Worker.findById(workerId);

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is required' });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      workerId: workerId,
      status: 'completed',
      workerPaymentStatus: 'PENDING'
    }).populate('vendorId'); // Ensure vendor is populated to access tokens

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found or already paid' });
    }

    if (!booking.vendorId) {
      return res.status(400).json({ success: false, message: 'No vendor associated with this booking' });
    }

    const vendor = booking.vendorId;
    const message = `Worker ${worker.name} has requested payment for Booking #${booking.bookingNumber}.`;
    const title = 'Payout Request';

    // Create DB Notification
    await Notification.create({
      recipient: vendor._id,
      vendorId: vendor._id,
      title: title,
      message: message,
      type: 'payout_requested',
      relatedId: booking._id,
      relatedType: 'booking',
      isRead: false
    });

    // Send High Priority Push Notification
    const fcmTokens = [
      ...(vendor.fcmTokens || []),
      ...(vendor.fcmTokenMobile || [])
    ];

    if (fcmTokens.length > 0) {
      await sendPushNotification(fcmTokens, {
        title: title,
        body: message,
        data: {
          type: 'payout_requested',
          relatedId: booking._id.toString(),
          relatedType: 'booking',
          url: `/vendor/booking/${booking._id}` // Helpful for deep linking if supported
        },
        highPriority: true // Explicit high priority
      });
    }

    res.status(200).json({ success: true, message: 'Payment request sent to vendor' });

  } catch (error) {
    console.error('Request payout error:', error);
    res.status(500).json({ success: false, message: 'Failed to send payout request' });
  }
};

module.exports = {
  getWallet,
  getTransactions,
  requestPayout
};
