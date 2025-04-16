const express = require('express');
const {
  sendMessage,
  getMessages,
  getConversations,
  markMessagesAsRead,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, sendMessage)
  .get(protect, getMessages);

router.get('/conversations', protect, getConversations);
router.put('/read', protect, markMessagesAsRead);

module.exports = router;
