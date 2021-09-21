const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./user.model").User;

const DB_URL = process.env.DB_URL;
const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true };

exports.createNewUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL, connectOptions)
      .then(() => {
        return User.findOne({ email: email });
      })
      .then((user) => {
        if (user) {
          mongoose.disconnect();
          reject("Email is already used");
        } else {
          return bcrypt.hash(password, 10);
        }
      })
      .then((hashedPassword) => {
        let user = new User({
          username: username,
          email: email,
          password: hashedPassword,
        });
        user.save((err) => {
          mongoose.disconnect();
          resolve();
        });
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.login = (email, password) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL, connectOptions)
      .then(() => {
        return User.findOne({ email: email });
      })
      .then((user) => {
        if (!user) {
          mongoose.disconnect();
          reject("There is no user matches this email");
        } else {
          bcrypt.compare(password, user.password).then((same) => {
            if (!same) {
              mongoose.disconnect();
              reject("Password is not valid");
            } else {
              mongoose.disconnect();
              resolve(user);
            }
          });
        }
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.googleLogin = (id, username, email, password) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL, connectOptions)
      .then(() => {
        return User.findOne({ googleId: id });
      })
      .then((user) => {
        if (user) {
          mongoose.disconnect();
          resolve(user);
        } else {
          let newUser = new User({
            username: username,
            email: email,
            googleId: id,
            password: password,
          });
          newUser.save(() => {
            mongoose.disconnect();
            resolve(newUser);
          });
        }
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
        console.log(err);
      });
  });
};
