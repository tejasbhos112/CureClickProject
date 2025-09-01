const mongoose = require("mongoose");


// Stores all chat data with messages embedded in the chat document
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["doctor", "patient"],
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const chatSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
    unique: true,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  messages: [messageSchema],
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
