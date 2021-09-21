const userModel = require("../models/user.model");

exports.getProfile = (req, res) => {
  let id = req.params.id,
    { userId, name, img } = req.session;

  if (!id) return res.redirect(`/profile/${userId}`);
  userModel
    .getUserById(id)
    .then((user) => {
      userModel
        .getFriends(id) // Get user friends
        .then((friends) => {
          res.render("profile", {
            isUser: userId,
            profileName: name,
            pageTitle: name,
            friends: friends.friends,
            friendRequests: req.friendRequests,
            myId: userId,
            myName: name,
            myImg: img,
            friendId: user._id,
            userImage: user.img,
            username: user.username,
            email: user.email,
            isOwn: id === userId,
            isFriends: user.friends.find((friend) => friend.id === userId),
            isRequestRecieved: user.sentRequests.find(
              (friend) => friend.id === userId
            ),
            isRequestSent: user.friendRequests.find(
              (friend) => friend.id === userId
            ),
          });
        })
        .catch((err) => {
          res.redirect("/notFound");
          console.log(err);
        });
    })
    .catch((err) => {
      res.redirect("/notFound");
      console.log(err);
    });
};
