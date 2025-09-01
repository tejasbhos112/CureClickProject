const Chat = require("../models/chatModel");

// Start or get existing chat
const startChat = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const { userId, userType } = req.user; // Get from authenticated user

    // Check if chat exists
    let chat = await Chat.findOne({ appointmentId });
    if (!chat) {
      chat = new Chat({
        appointmentId,
        roomId: `chat_${appointmentId}`,
        messages: [],
      });
      await chat.save();
    }

    res.status(200).json({
      chat,
      roomId: chat.roomId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch messages of a chat
const getMessages = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const chat = await Chat.findOne({ appointmentId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // Filter out invalid messages (those without senderId)
    const validMessages = chat.messages.filter(msg => msg.senderId);
    
    // If there are invalid messages, clean them up
    if (validMessages.length !== chat.messages.length) {
      console.log(`Cleaning up ${chat.messages.length - validMessages.length} invalid messages from chat ${chat._id}`);
      chat.messages = validMessages;
      await chat.save();
    }

    res.status(200).json(validMessages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  startChat,
  getMessages
};
