import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "./constants";
import { toast } from "react-toastify";

const Chat = ({ appointment, onClose, userType, userId }) => {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [chat, setChat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [roomId, setRoomId] = useState("");

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${BASE_URL}/chat/start`,
          { appointmentId: appointment._id },
          { withCredentials: true }
        );
        
        setChat(response.data.chat);
        setRoomId(response.data.roomId);
        
        // Load existing messages
        const messagesResponse = await axios.get(
          `${BASE_URL}/chat/messages/${appointment._id}`,
          { withCredentials: true }
        );
        setMessages(messagesResponse.data || []);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error starting chat:", error);
        toast.error("Failed to start chat");
        setIsLoading(false);
      }
    };

    if (appointment) {
      initializeChat();
    }
  }, [appointment]);

  // Initialize Socket.IO connection - only once
  useEffect(() => {
    if (roomId && !socketRef.current) {
      console.log("Creating new socket connection...");
      const newSocket = io(BASE_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      newSocket.on("connect", () => {
        console.log("Connected to Socket.IO with ID:", newSocket.id);
        setIsConnected(true);
        console.log("Joining chat room:", roomId);
        newSocket.emit("join_chat", roomId);
      });

      newSocket.on("receive_message", (data) => {
        console.log("=== MESSAGE RECEIVED ===");
        console.log("Received message data:", data);
        console.log("Current messages before adding:", messages);
        setMessages((prev) => {
          console.log("Previous messages:", prev);
          const newMessages = [...prev, data];
          console.log("New messages array:", newMessages);
          return newMessages;
        });
        console.log("=== MESSAGE RECEIVED END ===");
      });

      newSocket.on("messages_seen", (data) => {
        console.log("=== MESSAGES SEEN UPDATE ===");
        console.log("Received messages_seen event:", data);
        setMessages((prev) => 
          prev.map(msg => 
            msg.sender !== userType ? { ...msg, isRead: true } : msg
          )
        );
        console.log("=== MESSAGES SEEN UPDATE END ===");
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Disconnected from Socket.IO:", reason);
        setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
      });

      socketRef.current = newSocket;

      // Cleanup function
      return () => {
        console.log("Cleaning up socket connection...");
        if (socketRef.current) {
          socketRef.current.emit("leave_chat", roomId);
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [roomId]); // Only depend on roomId

  // Mark messages as seen when chat is opened or messages are received
  useEffect(() => {
    if (messages.length > 0 && isConnected) {
      markMessagesAsSeen();
    }
  }, [messages, isConnected]);

  const markMessagesAsSeen = async () => {
    try {
      // Check if there are unread messages from the other user
      const unreadMessages = messages.filter(msg => 
        msg.sender !== userType && !msg.isRead
      );
      
      if (unreadMessages.length > 0) {
        console.log(`Marking ${unreadMessages.length} messages as seen`);
        
        // Use socket to mark messages as seen
        if (socketRef.current) {
          socketRef.current.emit("mark_as_seen", {
            appointmentId: appointment._id,
            userType
          });
        }
      }
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && socketRef.current && isConnected) {
      const messageData = {
        roomId,
        message: newMessage.trim(),
        sender: userType,
        senderId: userId,
        appointmentId: appointment._id,
      };

      console.log("Sending message:", messageData);
      console.log("Current userId:", userId);
      console.log("Current userType:", userType);
      socketRef.current.emit("send_message", messageData);
      setNewMessage("");
    } else {
      console.log("Cannot send message:", { 
        hasMessage: !!newMessage.trim(), 
        hasSocket: !!socketRef.current, 
        isConnected,
        socketId: socketRef.current?.id,
        userId,
        userType
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Starting chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-teal-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💬</span>
            <div>
              <h2 className="text-lg font-semibold">
                Chat with Dr. {appointment.doctorId.name}
              </h2>
              <p className="text-sm opacity-90">
                {appointment.date} at {appointment.time}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <span className="text-6xl mb-2 block">💬</span>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === userType ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === userType
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-gray-800 border'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs ${
                        msg.sender === userType ? 'text-teal-100' : 'text-gray-500'
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                      {msg.sender === userType && (
                        <span className={`text-xs ml-2 ${
                          msg.isRead ? 'text-teal-100' : 'text-teal-200'
                        }`}>
                          {msg.isRead ? 'seen' : 'unseen'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={!isConnected}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || !isConnected}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              📤
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
