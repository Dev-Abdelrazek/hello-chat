const { newMessage } = require("../models/message.model");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
    });
    socket.on("sendMsg", (msg, cb) => {
      newMessage(msg).then(() => {
        io.to(msg.chat).emit("newMsg", msg);
        cb();
      });
    });
  });
};
