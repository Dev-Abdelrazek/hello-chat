const router = require("express").Router();
const msgsController = require("../controllers/messages.controller");
const authGuard = require("../routes/guards/auth.guard");

router.get("/", authGuard.isNotUser, msgsController.getMsgs);

module.exports = router;
