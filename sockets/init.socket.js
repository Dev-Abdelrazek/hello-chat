module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("notificationsRoom", (id) => {
      socket.join(id);
    });
    socket.on("goOnline", (id) => {
      io.onlineFriends[id] = true;
      socket.on("disconnect", () => {
        io.onlineFriends[id] = false;
      });
    });
  });
};
