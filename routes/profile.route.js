const router = require("express").Router();
const { isNotUser } = require("../routes/guards/auth.guard");
const profileController = require("../controllers/profile.controller");

router.get("/", isNotUser, profileController.getProfile);
router.get("/:id", isNotUser, profileController.getProfile);

module.exports = router;
