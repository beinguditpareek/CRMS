const express = require("express");
const router = express.Router();

const { Middleware } = require("../../middleware");
const { AdminUserMiddleware } = require("../../middleware/admin");

const { Controller, UserController } = require("../../controller");
const { UserMiddleware } = require("../../middleware");
router.post(
  "/",
  Middleware.AdminUserMiddleware.validateCreateUser,
  Controller.UserController.createUser
);
router.get("/", Controller.UserController.getAllUsers);
router.get("/:id", Controller.UserController.getUserById);
router.put("/access/:id", Controller.UserController.toggleIsBlocked);
// router.put('/changepassword/:id',AdminUserMiddleware.validateChangePassword,Controller.UserController.)
// router.post('/signout',Controller.AuthController.signOut)

router.put(
  "/changepassword/:id",
  Middleware.AdminAuthMiddleware.authenticateAdmin,
  Middleware.AdminAuthMiddleware.validateAdminResetPassword,
  Controller.UserController.adminResetUserPassword
);



module.exports = router;
