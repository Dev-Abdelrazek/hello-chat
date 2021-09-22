const { newMessage } = require("../models/message.model");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
    });
    // Send message
    socket.on("sendMsg", (msg, cb) => {
      newMessage(msg).then(() => {
        io.to(msg.chat).emit("newMsg", msg);
        cb();
      });
    });

    // Video call
    socket.on("requestPeerId", (chatId) => {
      socket.broadcast.to(chatId).emit("getPeerId");
    });

    socket.on("sendPeerId", (data) => {
      socket.broadcast.to(data.chatId).emit("recievePeerId", data.peerId);
    });
  });
};
