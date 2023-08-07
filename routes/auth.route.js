const authController = require("../controllers/auth.controller");
const express = require("express");
const loginController = require("../controllers/login.controller");
const {
  tokenRequireSignIn,
  tokenAdminVerify,
} = require("../middlewares/authMiddleware");

const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", authController.createRegisterController);
router.get("/register", authController.userGetAllData);

//LOGIN || METHOD POST
router.post("/login", loginController.createLogin);

//token test || METHOD GET
router.get(
  "/test",
  tokenRequireSignIn,
  tokenAdminVerify,
  authController.testToken
);

//user private route || METHOD GET
router.get(
  "/userPrivateRoute",
  tokenRequireSignIn,
  authController.userDashBoardController
);

//admin private route || METHOD GET
router.get(
  "/adminPrivateRoute",
  tokenRequireSignIn,
  tokenAdminVerify,
  authController.adminDashBoardController
);

//forgot password route || METHOD POST
router.post("/forgot-password", authController.forgotPasswordController);

// update user profile || METHOD PUT
router.put(
  "/update-profile",
  tokenRequireSignIn,
  authController.updateProfileController
);

module.exports = router;
