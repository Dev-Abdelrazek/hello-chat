const router = require("express").Router();
const bodyParser = require("body-parser").urlencoded({ extended: true });
const friendController = require("../controllers/friend.controller");
const { isNotUser } = require("../routes/guards/auth.guard");

router.post("/cancel", isNotUser, bodyParser, friendController.cancel);

router.post("/accept", isNotUser, bodyParser, friendController.accept);

router.post("/reject", isNotUser, bodyParser, friendController.reject);

router.post("/delete", isNotUser, bodyParser, friendController.delete);

router.get("/", isNotUser, friendController.getAllFriends);

module.exports = router;
