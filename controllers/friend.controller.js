const userModel = require("../models/user.model");

// Accept friend request
exports.accept = (req, res) => {
  let { friendId } = req.body;

  userModel
    .acceptFriendRequest(req.body)
    .then(() => {
      res.redirect(`/profile/${friendId}`);
    })
    .catch((err) => {
      res.redirect("/error");
      console.log(err);
    });
};

// Cancel friend request
exports.cancel = (req, res) => {
  let { friendId } = req.body;

  userModel
    .cancelFriendRequest(req.body)
    .then(() => {
      res.redirect(`/profile/${friendId}`);
    })
    .catch((err) => {
      res.redirect("/error");
      console.log(err);
    });
};

// Reject friend request
exports.reject = (req, res) => {
  let { friendId } = req.body;

  userModel
    .rejectFriendRequest(req.body)
    .then(() => {
      res.redirect(`/profile/${friendId}`);
    })
    .catch((err) => {
      res.redirect("/error");
      console.log(err);
    });
};

// Delete friend request
exports.delete = (req, res) => {
  let { friendId } = req.body;

  userModel
    .deleteFriend(req.body)
    .then(() => {
      res.redirect(`/profile/${friendId}`);
    })
    .catch((err) => {
      res.redirect("/error");
      console.log(err);
    });
};

// Get all user friends
exports.getAllFriends = (req, res) => {
  let id = req.session.userId,
    { userId, name } = req.session;

  userModel
    .getFriends(id)
    .then((friends) => {
      res.render("friends", {
        isUser: userId,
        profileName: name,
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
