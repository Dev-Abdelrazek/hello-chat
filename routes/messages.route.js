const router = require("express").Router();
const msgsController = require("../controllers/messages.controller");
const { isNotUser } = require("../routes/guards/auth.guard");

router.get("/", isNotUser, msgsController.getMsgs);

module.exports = router;
