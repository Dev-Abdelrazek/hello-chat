const router = require("express").Router();
const homeController = require("../controllers/home.controller");
const authGuard = require("../routes/guards/auth.guard");
const bodyParser = require("body-parser").urlencoded({ extended: true });
const check = require("express-validator").check;

router.get("/", authGuard.isNotUser, homeController.getHome);
router.post(
  "/",
  authGuard.isNotUser,
  bodyParser,
  check("email")
    .not()
    .isEmpty()
    .withMessage("Please enter an email to search")
    .isEmail()
    .withMessage("Email is not valid"),
  homeController.postHome
);

module.exports = router;
