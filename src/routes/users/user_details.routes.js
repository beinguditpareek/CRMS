const express = require("express");
const router = express.Router();
const Multer = require("../../utils/common");

const { UserController } = require("../../controller");
const { UserMiddleware } = require("../../middleware");
router.patch(
  "/update/:id",
  UserMiddleware.UserMiddleware.authenticateUser,
  Multer.upload.fields([
    { name: "school_logo", maxCount: 1 },
    { name: "school_assets", maxCount: 10 },
  ]),
  UserController.UserDetailsController.patchUserDetails
);
router.put(
  "/update/assets/:id",
  UserMiddleware.UserMiddleware.authenticateUser,

  Multer.upload.fields([
    { name: "school_logo", maxCount: 1 },
    { name: "school_assets", maxCount: 10 },
  ]),

  UserController.UserDetailsController.updateUserAssets
);

module.exports = router;
