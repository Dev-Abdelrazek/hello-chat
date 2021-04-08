const userModel = require("../models/user.model");
const validationResult = require("express-validator").validationResult;

exports.getHome = (req, res) => {
  res.render("index", {
    isUser: req.session.userId,
    profileName: req.session.name,
    searchError: req.flash("searchError")[0],
    friendRequests: req.friendRequests,
    pageTitle: "Home",
  });
};
exports.postHome = (req, res) => {
  if (validationResult(req).isEmpty()) {
    let email = req.body.email;
    if (typeof email !== "undefined") {
      userModel
        .getUserByEmail(email)
        .then((user) => {
          res.render("index", {
            isUser: req.session.userId,
            profileName: req.session.name,
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
        isUser: req.session.userId,
        profileName: req.session.name,
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
