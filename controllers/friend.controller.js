const userModel = require("../models/user.model");

exports.cancel = (req, res) => {
  userModel
    .cancelFriendRequest(req.body)
    .then(() => {
      res.redirect("/profile/" + req.body.friendId);
    })
    .catch((err) => {
      res.redirect("/error");
      console.log(err);
    });
};
exports.accept = (req, res) => {
  userModel
    .acceptFriendRequest(req.body)
    .then(() => {
      res.redirect("/profile/" + req.body.friendId);
    })
    .catch((err) => {
      res.redirect("/error");
      console.log(err);
    });
};
exports.reject = (req, res) => {
  userModel
    .rejectFriendRequest(req.body)
    .then(() => {
      res.redirect("/profile/" + req.body.friendId);
    })
    .catch((err) => {
      res.redirect("/error");
      console.log(err);
    });
};
exports.delete = (req, res) => {
  userModel
    .deleteFriend(req.body)
    .then(() => {
      res.redirect("/profile/" + req.body.friendId);
    })
    .catch((err) => {
      res.redirect("/error");
      console.log(err);
    });
};

exports.getAllFriends = (req, res) => {
  let id = req.session.userId;
  userModel
    .getFriends(id)
    .then((friends) => {
      res.render("friends", {
        isUser: req.session.userId,
        profileName: req.session.name,
        friendRequests: req.friendRequests,
        pageTitle: "Friends",
        friends: friends.friends,
      });
    })
    .catch((err) => {
      res.redirect("/error");
      console.log(err);
    });
};
