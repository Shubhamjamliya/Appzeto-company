const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');

// Placeholder routes - to be implemented
router.get('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'Notification route' });
});

module.exports = router;

