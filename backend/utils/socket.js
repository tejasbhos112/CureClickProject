const { Server } = require("socket.io");
const Chat = require("../models/chatModel");

let io;

function initSocket(httpServer, corsOrigin = "http://localhost:5173") {
  // Initialize Socket.IO
  io = new Server(httpServer, {
    cors: {
      origin: corsOrigin,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Handle socket connections
  io.on("connection", (socket) => {

    // Join a chat room (roomId = appointmentId)
    socket.on("join_chat", (roomId) => {
      socket.join(roomId);
    });

    // Send a message
    socket.on("send_message", async ({ roomId, message, sender, senderId, appointmentId }) => {
      try {
        let chat = await Chat.findOne({ appointmentId });
        if (!chat) {
          chat = new Chat({ appointmentId, roomId, messages: [] });
        }

        // Create message object
        const msg = { sender, senderId, content: message, timestamp: new Date(), isRead: false };

        // Add message to chat and save
        chat.messages.push(msg);
        await chat.save();

        // Broadcast message to all users in the room
        io.to(roomId).emit("receive_message", msg);

      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    });

    // Mark messages as seen
    socket.on("mark_as_seen", async ({ appointmentId, userType }) => {
      try {
        const chat = await Chat.findOne({ appointmentId });
        if (!chat) return;

        let updated = false;
        chat.messages.forEach(msg => {
          if (msg.sender !== userType && !msg.isRead) {
            msg.isRead = true;
            updated = true;
          }
        });

        if (updated) {
          await chat.save();
          const roomId = `chat_${appointmentId}`;
          io.to(roomId).emit("messages_seen", { appointmentId, by: userType });
        }
      } catch (error) {
        console.error("Error marking messages as seen:", error.message);
      }
    });

    // Leave a chat room
    socket.on("leave_chat", (roomId) => {
      socket.leave(roomId);
    });

    // Handle disconnect
    socket.on("disconnect", () => {});
  });

  return io;
}

module.exports = { initSocket };
