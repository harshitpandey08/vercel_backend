const Message = require('../models/messageModel');
const User = require('../models/userModel');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;

    // Check if receiver exists
    const receiverExists = await User.findById(receiver);
    if (!receiverExists) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      content,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName profileImage')
      .populate('receiver', 'firstName lastName profileImage');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all messages for a user
// @route   GET /api/messages
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { with: withUser } = req.query;

    let query = {
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id },
      ],
    };

    // If withUser is provided, filter messages between the current user and withUser
    if (withUser) {
      query = {
        $or: [
          { sender: req.user._id, receiver: withUser },
          { sender: withUser, receiver: req.user._id },
        ],
      };
    }

    const messages = await Message.find(query)
      .populate('sender', 'firstName lastName profileImage')
      .populate('receiver', 'firstName lastName profileImage')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all conversations for a user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    // Get all messages where the user is either sender or receiver
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id },
      ],
    })
      .populate('sender', 'firstName lastName profileImage')
      .populate('receiver', 'firstName lastName profileImage')
      .sort({ createdAt: -1 });

    // Extract unique conversations
    const conversations = [];
    const conversationMap = new Map();

    messages.forEach(message => {
      const otherUser = message.sender._id.toString() === req.user._id.toString()
        ? message.receiver
        : message.sender;
      
      const otherUserId = otherUser._id.toString();

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          user: {
            _id: otherUser._id,
            firstName: otherUser.firstName,
            lastName: otherUser.lastName,
            profileImage: otherUser.profileImage,
          },
          lastMessage: {
            content: message.content,
            createdAt: message.createdAt,
            isRead: message.isRead,
          },
        });
      }
    });

    // Convert map to array
    conversationMap.forEach(value => {
      conversations.push(value);
    });

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/read
// @access  Private
const markMessagesAsRead = async (req, res) => {
  try {
    const { sender } = req.body;

    await Message.updateMany(
      {
        sender,
        receiver: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getConversations,
  markMessagesAsRead,
};
