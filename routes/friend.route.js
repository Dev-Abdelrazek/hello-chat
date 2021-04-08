const router = require("express").Router();
const bodyParser = require("body-parser").urlencoded({ extended: true });

const friendController = require("../controllers/friend.controller");
const authGuard = require("../routes/guards/auth.guard");

router.post(
  "/cancel",
  authGuard.isNotUser,
  bodyParser,
  friendController.cancel
);
router.post(
  "/accept",
  authGuard.isNotUser,
  bodyParser,
  friendController.accept
);
router.post(
  "/reject",
  authGuard.isNotUser,
  bodyParser,
  friendController.reject
);
router.post(
  "/delete",
  authGuard.isNotUser,
  bodyParser,
  friendController.delete
);

router.get("/", authGuard.isNotUser, friendController.getAllFriends);
module.exports = router;
