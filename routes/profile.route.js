const router = require("express").Router();
const authGuard = require("../routes/guards/auth.guard");
const profileController = require("../controllers/profile.controller");

router.get("/", authGuard.isNotUser, profileController.getProfile);
router.get("/:id", authGuard.isNotUser, profileController.getProfile);

module.exports = router;
