const validationResult = require("express-validator").validationResult;
const authModel = require("../models/auth.model");
exports.getSignup = (req, res) => {
  res.render("signup", {
    isUser: false,
    profileName: req.session.name,
    pageTitle: "Register",
    validationErrors: req.flash("validationErrors"),
    signupError: req.flash("signupError")[0],
    inputSignupValues: req.flash("inputSignupValues")[0],
  });
};
exports.postSignup = (req, res) => {
  req.flash("inputSignupValues", req.body);
  if (validationResult(req).isEmpty()) {
    authModel
      .createNewUser(req.body.username, req.body.email, req.body.password)
      .then(() => {
        res.render("login", {
          isUser: false,
          profileName: req.session.name,
          pageTitle: "Login",
          acountCreated: true,
          loginError: req.flash("loginError")[0],
          validationErrors: req.flash("validationErrors"),
        });
      })
      .catch((err) => {
        req.flash("signupError", err);
        res.redirect("/signup");
      });
  } else {
    req.flash("validationErrors", validationResult(req).array());
    res.redirect("/signup");
  }
};
exports.getLogin = (req, res) => {
  res.render("login", {
    isUser: false,
    profileName: req.session.name,
    pageTitle: "Login",
    acountCreated: false,
    loginError: req.flash("loginError")[0],
    validationErrors: req.flash("validationErrors"),
    inputLoginValues: req.flash("inputLoginValues")[0],
  });
};
exports.postLogin = (req, res) => {
  req.flash("inputLoginValues", req.body);
  if (validationResult(req).isEmpty()) {
    authModel
      .login(req.body.email, req.body.password)
      .then((user) => {
        req.session.userId = String(user._id);
        req.session.name = user.username;
        req.session.img = user.img;
        res.redirect("/");
      })
      .catch((err) => {
        req.flash("loginError", err);
        res.redirect("/login");
      });
  } else {
    console.log(req.body);
    req.flash("validationErrors", validationResult(req).array());
    res.redirect("/login");
  }
};

exports.getLoginByGoogle = async (req, res) => {
  await authModel.googleLogin(
    req.user.id,
    req.user._json.given_name,
    req.user._json.email,
    ""
  );
  await authModel
    .findGoogleUser(req.user.id)
    .then((user) => {
      req.session.userId = String(user._id);
      req.session.name = user.username;
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
