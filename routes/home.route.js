const router = require("express").Router();
const homeController = require("../controllers/home.controller");
const { check } = require("express-validator");
const { isNotUser } = require("../routes/guards/auth.guard");
const bodyParser = require("body-parser").urlencoded({ extended: true });

router.get("/", isNotUser, homeController.getHome);

router.post(
  "/",
  isNotUser,
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
