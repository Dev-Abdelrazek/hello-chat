const messageModel = require("../models/message.model");
const chatModel = require("../models/chat.model");
const moment = require("moment");

exports.getChat = (req, res, next) => {
  let chatId = req.params.id,
    { userId, name } = req.session;

  // Get friend messages and his data
  messageModel
    .getMessages(chatId)
    .then((messages) => {
      chatModel
        .getChat(chatId)
        .then((chat) => {
          let friendData = chat.users.find((user) => user._id != userId);
          res.render("chat", {
            isUser: userId,
            profileName: name,
            friendRequests: req.friendRequests,
            pageTitle: friendData.username,
            friendData: friendData,
            messages: messages,
            chatId: chatId,
            moment: moment,
          });
        })
        .catch((err) => {
          res.redirect("/error");
          console.log(err);
        });
    })
    .catch((err) => {
      res.redirect("/error");
      console.log(err);
    });
};
