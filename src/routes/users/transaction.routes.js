const express = require("express");
const router = express.Router();
const {UserController} = require('../../controller')
const {Middleware} = require('../../middleware')

router.post("/initiate", Middleware.AdminUserMiddleware.authenticateUser,UserController.UserTransactionController.createTransaction);
router.post("/complete", Middleware.AdminUserMiddleware.authenticateUser,UserController.UserTransactionController.completeTransaction);

module.exports = router;
