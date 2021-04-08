const router = require("express").Router();
const bodyParser = require("body-parser").urlencoded({ extended: true });

const authGuard = require("../routes/guards/auth.guard");
const groupController = require("../controllers/group.controller");

router.get("/", authGuard.isNotUser, groupController.getUserGroups);
router.get("/create", authGuard.isNotUser, groupController.getCreateGroup);
router.post(
  "/create",
  authGuard.isNotUser,
  bodyParser,
  groupController.postCreateGroup
);
router.post(
  "/delete",
  authGuard.isNotUser,
  bodyParser,
  groupController.deleteGroup
);
router.get("/:id", authGuard.isNotUser, groupController.getGroup);

module.exports = router;
