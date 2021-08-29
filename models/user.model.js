const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL;
const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const Chat = require("./chat.model").Chat;

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  img: { type: String, default: "defaultUserImg.png" },
  isOnline: { type: Boolean, default: false },
  friends: {
    type: [{ name: String, img: String, id: String, chatId: String }],
    default: [],
  },
  friendRequests: {
    type: [{ name: String, id: String }],
    default: [],
  },
  sentRequests: {
    type: [{ name: String, id: String }],
    default: [],
  },
  googleId: String,
});
const User = mongoose.model("user", userSchema);
exports.User = User;
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL, connectOptions)
      .then(() => {
        return User.findById(id);
      })
      .then((user) => {
        mongoose.disconnect();
        resolve(user);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

exports.addFriendRequest = async (data) => {
  try {
    await mongoose.connect(DB_URL, connectOptions);
    await Promise.all([
      User.updateOne(
        { _id: data.myId },
        {
          $push: { sentRequests: { name: data.friendName, id: data.friendId } },
        }
      ),
      User.updateOne(
        { _id: data.friendId },
        { $push: { friendRequests: { name: data.myName, id: data.myId } } }
      ),
    ]);
    mongoose.disconnect();
    return;
  } catch (err) {
    mongoose.disconnect();
    throw new Error(err);
  }
};

exports.cancelFriendRequest = async (data) => {
  try {
    await mongoose.connect(DB_URL, connectOptions);
    await Promise.all([
      User.updateOne(
        { _id: data.myId },
        { $pull: { sentRequests: { id: data.friendId } } }
      ),
      User.updateOne(
        { _id: data.friendId },
        { $pull: { friendRequests: { id: data.myId } } }
      ),
    ]);
    mongoose.disconnect();
    return;
  } catch (err) {
    mongoose.disconnect();
    throw new Error(err);
  }
};
exports.acceptFriendRequest = async (data) => {
  try {
    await mongoose.connect(DB_URL, connectOptions);
    let newChat = new Chat({
      users: [data.myId, data.friendId],
    });
    let chatDoc = await newChat.save();
    await Promise.all([
      User.updateOne(
        { _id: data.friendId },
        {
          $push: {
            friends: {
              name: data.myName,
              img: data.myImg,
              id: data.myId,
              chatId: chatDoc._id,
            },
          },
        }
      ),
      User.updateOne(
        { _id: data.myId },
        {
          $push: {
            friends: {
              name: data.friendName,
              img: data.friendImg,
              id: data.friendId,
              chatId: chatDoc._id,
            },
          },
        }
      ),
    ]);

    await Promise.all([
      User.updateOne(
        { _id: data.friendId },
        { $pull: { sentRequests: { id: data.myId } } }
      ),
      User.updateOne(
        { _id: data.myId },
        { $pull: { friendRequests: { id: data.friendId } } }
      ),
    ]);
    mongoose.disconnect();
    return;
  } catch (err) {
    mongoose.disconnect();
    throw new Error(err);
  }
};
exports.rejectFriendRequest = async (data) => {
  try {
    await mongoose.connect(DB_URL, connectOptions);
    await Promise.all([
      User.updateOne(
        { _id: data.friendId },
        { $pull: { sentRequests: { id: data.myId } } }
      ),
      User.updateOne(
        { _id: data.myId },
        { $pull: { friendRequests: { id: data.friendId } } }
      ),
    ]);
    mongoose.disconnect();
    return;
  } catch (err) {
    mongoose.disconnect();
    throw new Error(err);
  }
};
exports.deleteFriend = async (data) => {
  try {
    await mongoose.connect(DB_URL, connectOptions);
    await Promise.all([
      User.updateOne(
        { _id: data.myId },
        { $pull: { friends: { id: data.friendId } } }
      ),
      User.updateOne(
        { _id: data.friendId },
        { $pull: { friends: { id: data.myId } } }
      ),
    ]);
    mongoose.disconnect();
    return;
  } catch (err) {
    mongoose.disconnect();
    throw new Error(err);
  }
};

exports.getFriendRequests = async (id) => {
  try {
    await mongoose.connect(DB_URL, connectOptions);
    let data = await User.findById(id, { friendRequests: true });
    mongoose.disconnect();
    return data.friendRequests;
  } catch (err) {
    mongoose.disconnect();
    throw new Error(err);
  }
};

// exports.getFriendRequests = (id) => {
//   return new Promise((resolve, reject) => {
//     mongoose
//       .connect(DB_URL, connectOptions)
//       .then(() => {
//         let data = User.findById(id, { friendRequests: true });
//         return data.friendRequests;
//       })
//       .then((result) => {
//         mongoose.disconnect();
//         resolve(result);
//       })
//       .catch((err) => {
//         mongoose.disconnect();
//         reject(err);
//       });
//   });
// };

exports.getFriends = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL, connectOptions)
      .then(() => {
        return User.findById(id, { friends: true });
      })
      .then((friends) => {
        mongoose.disconnect();
        resolve(friends);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
exports.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL, connectOptions)
      .then(() => {
        return User.findOne({ email: email });
      })
      .then((user) => {
        mongoose.disconnect();
        resolve(user);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
