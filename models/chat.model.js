const mongoose = require("mongoose");
const DB_URL =
  "mongodb+srv://abdelrazek:abdelrazek@cluster0.qcugc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const chatSchema = mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});

const Chat = mongoose.model("chat", chatSchema);
exports.getChat = async (chatId) => {
  try {
    await mongoose.connect(DB_URL, connectOptions);
    let chat = await Chat.findById(chatId).populate("users");
    mongoose.disconnect();
    return chat;
  } catch (err) {
    mongoose.disconnect();
    throw new Error(err);
  }
};

exports.Chat = Chat;
