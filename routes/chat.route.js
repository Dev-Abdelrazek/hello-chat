const router = require("express").Router();
const chatController = require("../controllers/chat.controller");
const authGuard = require("../routes/guards/auth.guard");

router.get("/:id", authGuard.isNotUser, chatController.getChat);

module.exports = router;
