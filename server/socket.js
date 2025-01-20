import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessageModel.js";
const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });
  const disconnect = (socket) => {
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };
  const userSocketMap = new Map();
  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);
    const createMessage = await Message.create(message);
    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id firstName lastName image color")
      .populate("recipient", "id firstName lastName image color");

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("recieveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("recieveMessage", messageData);
    }
  };
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
    } else {
      console.log("No user id found in handshake query");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => {
      disconnect(socket);
    });
  });
};
export default setupSocket;
