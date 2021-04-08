const mongoose = require("mongoose");
// const moment = require("moment")();
const DB_URL =
  "mongodb+srv://abdelrazek:abdelrazek@cluster0.qcugc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const messageSchema = mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "chat" },
  content: String,
  sender: String,
  timestamp: Number,
});

const Message = mongoose.model("message", messageSchema);

exports.getMessages = async (chatId) => {
  try {
    await mongoose.connect(DB_URL, connectOptions);
    let messages = await Message.find({ chat: chatId }, null, {
      sort: {
        timestamp: 1,
      },
    }).populate({
      path: "chat", //field name
      model: "chat",
      populate: {
        path: "users",
        model: "user",
        select: "username img", // the seprator is the space
      },
    });
    mongoose.disconnect();
    return messages;
  } catch (err) {
    mongoose.disconnect();
    throw new Error(err);
  }
};

exports.getLastMsg = async (chatId) => {
  try {
    await mongoose.connect(DB_URL, connectOptions);
    let messages = await Message.find({ chat: chatId }, null, {
      sort: {
        timestamp: -1,
      },
      limit: 1,
    }).populate({
      path: "chat", //field name
      model: "chat",
      populate: {
        path: "users",
        model: "user",
        select: "username img", // the seprator is the space
      },
    });
    mongoose.disconnect();
    return messages;
  } catch (err) {
    mongoose.disconnect();
    throw new Error(err);
  }
};

exports.newMessage = async (msg) => {
  try {
    await mongoose.connect(DB_URL, connectOptions);
    msg.timestamp = Date.now();
    let newMsg = await new Message(msg);
    await newMsg.save();
    mongoose.disconnect();
    return;
  } catch (err) {
    mongoose.disconnect();
    throw new Error(err);
  }
};
