const userModel = require("../models/user.model");

exports.getProfile = (req, res) => {
  let id = req.params.id;
  if (!id) return res.redirect("/profile/" + req.session.userId);
  userModel
    .getUserById(id)
    .then((user) => {
      userModel
        .getFriends(id)
        .then((friends) => {
          res.render("profile", {
            isUser: req.session.userId,
            profileName: req.session.name,
            pageTitle: req.session.name,
            friends: friends.friends,
            friendRequests: req.friendRequests,
            myId: req.session.userId,
            myName: req.session.name,
            myImg: req.session.img,
            friendId: user._id,
            userImage: user.img,
            username: user.username,
            email: user.email,
            isOwn: id === req.session.userId,
            isFriends: user.friends.find(
              (friend) => friend.id === req.session.userId
            ),
            isRequestRecieved: user.sentRequests.find(
              (friend) => friend.id === req.session.userId
            ),
            isRequestSent: user.friendRequests.find(
              (friend) => friend.id === req.session.userId
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
