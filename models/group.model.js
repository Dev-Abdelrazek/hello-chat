const mongoose = require("mongoose");
const DB_URL =
  "mongodb+srv://abdelrazek:abdelrazek@cluster0.qcugc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const groupSchema = mongoose.Schema({
  name: String,
  image: { type: String, default: "default-group-image.png" },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});

const Group = mongoose.model("group", groupSchema);

exports.createGroup = async (data) => {
  try {
    await mongoose.connect(DB_URL, connectOptions);
    let group = new Group(data);
    let groupData = await group.save();
    mongoose.disconnect();
    return groupData._id;
  } catch (error) {
    mongoose.disconnect();
    throw new Error(error);
  }
};

exports.getUserGroups = async (userId) => {
  try {
    await mongoose.connect(DB_URL, connectOptions);
    let groups = await Group.find({
      users: {
        $all: [userId],
      },
    });
    mongoose.disconnect();
    return groups;
  } catch (error) {
    mongoose.disconnect();
    throw new Error(error);
  }
};

exports.getGroupInfo = async (groupId) => {
  try {
    await mongoose.connect(DB_URL, connectOptions);
    let group = await Group.findById(groupId).populate({
      path: "users",
      model: "user",
      select: "username img",
    });
    mongoose.disconnect();
    return group;
  } catch (error) {
    mongoose.disconnect();
    throw new Error(error);
  }
};

exports.deleteGroup = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL, connectOptions)
      .then(() => {
        return Group.deleteOne({ _id: id });
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
