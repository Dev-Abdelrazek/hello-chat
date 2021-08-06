const groupModel = require("../models/group.model");
const messagesModel = require("../models/group-message.model");
const getFriends = require("../models/user.model").getFriends;
const moment = require("moment");

exports.getUserGroups = (req, res) => {
  groupModel
    .getUserGroups(req.session.userId)
    .then((groups) => {
      res.render("groups", {
        pageTitle: "Groups",
        isUser: req.session.userId,
        profileName: req.session.name,
        friendRequests: req.friendRequests,
        groups: groups,
      });
    })
    .catch((err) => {
      res.redirect("/error");
      console.log(err);
    });
};

exports.getCreateGroup = (req, res) => {
  getFriends(req.session.userId)
    .then((friends) => {
      res.render("create-group", {
        pageTitle: "Create Group",
        isUser: req.session.userId,
        profileName: req.session.name,
        friendRequests: req.friendRequests,
        friends: friends.friends,
      });
    })
    .catch((err) => {
      res.redirect("/error");
      console.log(err);
    });
};

exports.postCreateGroup = (req, res) => {
  groupModel
    .createGroup(req.body)
    .then((id) => {
      res.redirect("/groups/" + id);
    })
    .catch((err) => {
      res.redirect("/error");
      console.log(err);
    });
};

exports.getGroup = (req, res) => {
  let chatId = req.params.id;
  messagesModel
    .getMessages(chatId)
    .then((messages) => {
      if (messages.length === 0) {
        groupModel
          .getGroupInfo(chatId)
          .then((data) => {
            res.render("group-chat", {
              pageTitle: data.name,
              isUser: req.session.userId,
              profileName: req.session.name,
              friendRequests: req.friendRequests,
              messages: messages,
              group: data,
              moment: moment,
            });
          })
          .catch((err) => {
            res.redirect("/notFound");
            console.log(err);
          });
      } else {
        res.render("group-chat", {
          pageTitle: messages[0].group.name,
          isUser: req.session.userId,
          profileName: req.session.name,
          friendRequests: req.friendRequests,
          messages: messages,
          group: messages[0].group,
          moment: moment,
        });
      }
    })
    .catch((err) => {
      res.redirect("/error");
      console.log(err);
    });
};
exports.deleteGroup = (req, res) => {
  let groupId = req.body.groupId;
  groupModel
    .deleteGroup(groupId)
    .then(() => {
      res.redirect("/groups");
    })
    .catch((err) => {
      res.redirect("/error");
      console.log(err);
    });
  messagesModel.deleteGroupMsgs(groupId).catch((err) => {
    res.redirect("/error");
    console.log(err);
  });
};
