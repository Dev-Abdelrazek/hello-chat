const messageModel = require("../models/message.model");
const userModel = require("../models/user.model");
const moment = require("moment");

exports.getMsgs = (req, res) => {
  let id = req.session.userId;
  userModel
    .getFriends(id)
    .then((friends) => {
      let chatIds = [];
      for (let i = 0; i < friends.friends.length; i++) {
        chatIds.push(friends.friends[i].chatId);
      }
      let lastmsgs = async (ids) => {
        let msgs = [];
        for (let j = 0; j < ids.length; j++) {
          try {
            await messageModel
              .getLastMsg(ids[j])
              .then((msg) => {
                msgs.push(msg);
              })
              .catch((err) => {
                res.redirect("/error");
                console.log(err);
              });
          } catch (err) {
            throw new Error(err);
          }
        }
        return msgs;
      };
      lastmsgs(chatIds).then((msgs) => {
        res.render("messages", {
          isUser: req.session.userId,
          profileName: req.session.name,
          friendRequests: req.friendRequests,
          pageTitle: "Messages",
          friends: friends.friends,
          msgs: msgs.flat(),
          moment: moment,
        });
      });
    })
    .catch((err) => {
      res.redirect("/error");
      console.log(err);
    });
};
