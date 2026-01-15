const express = require("express");
const router = express.Router();
const Multer = require("../../utils/common");
const { Controller } = require("../../controller");
const { Middleware } = require("../../middleware");

// const { UserController } = require("../../controller");
// const { UserMiddleware } = require("../../middleware");
router.post(
  "/",
  Multer.upload.fields([
    { name: "school_logo", maxCount: 1 },
    { name: "school_assets", maxCount: 5 },
  ]),
  Middleware.AdminUserDetailsMiddleware.validateCreateUserDetails,
  Controller.UserDetailsController.createUserDetails
);

router.patch(
  "/update/:id",
   Middleware.AdminAuthMiddleware.authenticateAdmin,
  Multer.upload.fields([
    { name: "school_logo", maxCount: 1 },
    { name: "school_assets", maxCount: 10 },
  ]),
  Controller.UserDetailsController.patchUserDetailsByAdmin
);
router.put(
  "/update/assets/:id",
     Middleware.AdminAuthMiddleware.authenticateAdmin,


  Multer.upload.fields([
    { name: "school_logo", maxCount: 1 },
    { name: "school_assets", maxCount: 10 },
  ]),
Controller.UserDetailsController.updateUserAssetsByAdmin
);

router.get("/", Controller.UserDetailsController.getAllUserDetails);
router.delete("/:id", Controller.UserDetailsController.deleteUserDetails);

module.exports = router;
