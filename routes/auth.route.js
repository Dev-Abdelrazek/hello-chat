const router = require("express").Router();
const bodyParser = require("body-parser").urlencoded({ extended: true });

const check = require("express-validator").check;
const authController = require("../controllers/auth.controller");
const authGuard = require("../routes/guards/auth.guard");

router.get("/signup", authGuard.isUser, authController.getSignup);

router.post(
  "/signup",
  authGuard.isUser,
  bodyParser,
  check("username")
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .isLength({ min: 2 })
    .withMessage("Username must be at least 2 characters"),
  check("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not vaild"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  check("confirmPassword").custom((value, { req }) => {
    if (value == req.body.password) return true;
    else throw "Passwords is not the same";
  }),
  authController.postSignup
);
router.get("/login", authGuard.isUser, authController.getLogin);
router.post(
  "/login",
  authGuard.isUser,
  bodyParser,
  check("email")
    .not()
    .isEmpty()
    .withMessage("Eamil is required")
    .isEmail()
    .withMessage("Email is not valid"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  authController.postLogin
);

router.post("/logout", authController.logout);

module.exports = router;
