const messageModel = require("../models/message.model");
const chatModel = require("../models/chat.model");
const moment = require("moment");

exports.getChat = (req, res, next) => {
  let chatId = req.params.id;
  messageModel
    .getMessages(chatId)
    .then((messages) => {
      chatModel
        .getChat(chatId)
        .then((chat) => {
          let friendData = chat.users.find(
            (user) => user._id != req.session.userId
          );
          res.render("chat", {
            isUser: req.session.userId,
            profileName: req.session.name,
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
      res.redirect("/notFound");
      console.log(err);
    });
};
