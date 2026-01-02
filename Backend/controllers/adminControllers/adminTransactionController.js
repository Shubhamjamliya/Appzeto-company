const Transaction = require('../../models/Transaction');
const Booking = require('../../models/Booking');
const User = require('../../models/User');

/**
 * Get all transactions with pagination and filtering
 */
const getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, type } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};

    // Apply status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Apply type filter
    if (type && type !== 'all') {
      query.type = type;
    }

    // Apply search filter (Transaction ID, Order ID, or Customer Name/Email)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      
      // We need to find matching users and bookings first to search by their fields
      const [users, bookings] = await Promise.all([
        User.find({ $or: [{ name: searchRegex }, { email: searchRegex }] }).select('_id'),
        Booking.find({ bookingNumber: searchRegex }).select('_id')
      ]);

      const userIds = users.map(u => u._id);
      const bookingIds = bookings.map(b => b._id);

      query.$or = [
        { referenceId: searchRegex },
        { userId: { $in: userIds } },
        { bookingId: { $in: bookingIds } }
      ];
      
      // If it looks like an ObjectId, search by ID too
      if (search.match(/^[0-9a-fA-F]{24}$/)) {
        query.$or.push({ _id: search });
      }
    }

    const transactions = await Transaction.find(query)
      .populate('userId', 'name email phone')
      .populate('bookingId', 'bookingNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
};

/**
 * Get transaction statistics for dashboard
 */
const getTransactionStats = async (req, res) => {
  try {
    // We only count 'completed' transactions for revenue
    const revenueStats = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
          type: { $in: ['credit', 'debit', 'refund'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ['$type', 'credit'] }, '$amount', 0]
            }
          },
          totalRefunds: {
            $sum: {
              $cond: [{ $eq: ['$type', 'refund'] }, '$amount', 0]
            }
          }
        }
      }
    ]);

    const stats = revenueStats[0] || { totalRevenue: 0, totalRefunds: 0 };
    const netRevenue = stats.totalRevenue - stats.totalRefunds;

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: stats.totalRevenue,
        totalRefunds: stats.totalRefunds,
        netRevenue
      }
    });
  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction statistics'
    });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionStats
};
