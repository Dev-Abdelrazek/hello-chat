const express = require("express");
const app = express();
const server = require("http").createServer(app);
const path = require("path");
const flash = require("connect-flash");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv").config();

// Import user model
const userModel = require("./models/user.model");

// Socket
const socketIO = require("socket.io");
const io = socketIO(server);
require("./sockets/friend.socket")(io);
require("./sockets/init.socket")(io);
require("./sockets/chat.socket")(io);
require("./sockets/group.socket")(io);
io.onlineFriends = {};

// Import Routes
const authRouter = require("./routes/auth.route");
const homeRouter = require("./routes/home.route");
const profileRouter = require("./routes/profile.route");
const friendRouter = require("./routes/friend.route");
const chatRouter = require("./routes/chat.route");
const msgsRouter = require("./routes/messages.route");
const groupRouter = require("./routes/group.route");

// Set static path to assets
app.use(express.static(path.join(__dirname, "assets")));

// Set view engine to ejs
app.set("view engine", "ejs");
app.set("views", "views");

//Google Auth
app.use(passport.initialize());
app.use(passport.session());
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/google",
    },
    (accessToken, refreshToken, profile, callback) => {
      callback(null, profile);
    }
  )
);
passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// Session setup
const session = require("express-session");
const SessionStore = require("connect-mongodb-session")(session);
const Store = new SessionStore({
  uri: process.env.DB_URL,
  collection: "sessions",
});
app.use(
  session({
    secret: "my name is abdelrazek ali",
    store: Store,
    saveUninitialized: false,
    resave: true,
  })
);

// Set flash to path errors between reqs
app.use(flash());

// Middleware to store friend requests in every app req
app.use((req, res, next) => {
  let id = req.session.userId;

  if (id) {
    userModel
      .getFriendRequests(id)
      .then((requests) => {
        req.friendRequests = requests;
        next();
      })
      .catch((err) => {
        res.redirect("/error");
        console.log(err);
      });
  } else {
    next();
  }
});

// Routes Middlewares
app.use(homeRouter);
app.use(authRouter);
app.use("/profile", profileRouter);
app.use("/friend", friendRouter);
app.use("/chat", chatRouter);
app.use("/messages", msgsRouter);
app.use("/groups", groupRouter);
app.get("/error", (req, res, next) => {
  res.status(500);
  res.render("error", {
    isUser: req.session.userId,
    profileName: req.session.name,
    friendRequests: req.friendRequests,
    pageTitle: "Error",
  });
});
app.use((req, res) => {
  res.status(404);
  res.render("notFound", {
    isUser: req.session.userId,
    profileName: req.session.name,
    friendRequests: req.friendRequests,
    pageTitle: "Not Found",
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("Server is listen on port " + port);
});
