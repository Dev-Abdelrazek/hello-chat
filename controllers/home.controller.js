const userModel = require("../models/user.model");
const validationResult = require("express-validator").validationResult;

exports.getHome = (req, res) => {
  let { userId, name } = req.session;

  res.render("index", {
    isUser: userId,
    profileName: name,
    searchError: req.flash("searchError")[0],
    friendRequests: req.friendRequests,
    pageTitle: "Home",
  });
};

exports.postHome = (req, res) => {
  let { userId, name } = req.session;

  if (validationResult(req).isEmpty()) {
    let email = req.body.email;
    if (typeof email !== "undefined") {
      userModel
        .getUserByEmail(email)
        .then((user) => {
          res.render("index", {
            isUser: userId,
            profileName: name,
            searchError: req.flash("searchError")[0],
            friendRequests: req.friendRequests,
            pageTitle: "Home",
            userResult: user,
          });
        })
        .catch((err) => {
          res.redirect("/error");
          console.log(err);
        });
    } else {
      res.render("index", {
        isUser: userId,
        profileName: name,
        searchError: req.flash("searchError")[0],
        friendRequests: req.friendRequests,
        pageTitle: "Home",
      });
    }
  } else {
    req.flash("searchError", validationResult(req).array());
    res.redirect("/");
  }
};
