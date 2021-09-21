const { addFriendRequest, getFriends } = require("../models/user.model");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("sendFriendRequest", (data) => {
      addFriendRequest(data)
        .then(() => {
          socket.emit("requestSent");
          io.to(data.friendId).emit("newFriendRequest", {
            name: data.myName,
            id: data.myId,
          });
        })
        .catch((err) => {
          socket.emit("requestFaild");
        });
    });

    socket.on("getOnlineFriends", (id) => {
      getFriends(id)
        .then((friends) => {
          let onlineFriends = friends.friends.filter(
            (friend) => io.onlineFriends[friend.id]
          );
          socket.emit("onlineFriends", onlineFriends);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
};
