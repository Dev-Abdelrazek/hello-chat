const messageModel = require("../models/message.model");
const userModel = require("../models/user.model");
const moment = require("moment");

exports.getMsgs = (req, res) => {
  let id = req.session.userId;

  // Get user friends
  userModel
    .getFriends(id)
    .then((friends) => {
      // Make an array from chat ids
      let chatIds = [];
      for (let i = 0; i < friends.friends.length; i++) {
        chatIds.push(friends.friends[i].chatId);
      }

      // Function to get last message from every chat
      let lastmsgs = async (ids) => {
        let msgs = [];
        for (let j = 0; j < ids.length; j++) {
          await messageModel.getLastMsg(ids[j]).then((msg) => {
            msgs.push(msg);
          });
        }
        return msgs;
      };
      // Render last messages
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
