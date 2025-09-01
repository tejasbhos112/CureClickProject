const mongoose = require("mongoose");
const Chat = require("./models/chatModel");

// Connect to database
mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017/grocery-store")
  .then(() => console.log("Connected to database"))
  .catch(err => console.error("Database connection error:", err));

async function cleanupInvalidMessages() {
  try {
    console.log("Starting cleanup of invalid messages...");
    
    // Find all chats
    const chats = await Chat.find({});
    console.log(`Found ${chats.length} chats to check`);
    
    let totalCleaned = 0;
    
    for (const chat of chats) {
      const originalCount = chat.messages.length;
      const validMessages = chat.messages.filter(msg => msg.senderId);
      const invalidCount = originalCount - validMessages.length;
      
      if (invalidCount > 0) {
        console.log(`Chat ${chat._id}: Cleaning up ${invalidCount} invalid messages`);
        chat.messages = validMessages;
        await chat.save();
        totalCleaned += invalidCount;
      }
    }
    
    console.log(`Cleanup complete! Removed ${totalCleaned} invalid messages from ${chats.length} chats`);
    process.exit(0);
  } catch (error) {
    console.error("Cleanup error:", error);
    process.exit(1);
  }
}

cleanupInvalidMessages();
