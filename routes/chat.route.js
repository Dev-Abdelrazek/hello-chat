const router = require("express").Router();
const chatController = require("../controllers/chat.controller");
const { isNotUser } = require("../routes/guards/auth.guard");

router.get("/:id", isNotUser, chatController.getChat);

module.exports = router;
