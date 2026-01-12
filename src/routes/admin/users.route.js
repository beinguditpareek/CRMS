const express = require('express')
const router = express.Router()

const { Controller } = require('../../controller')
const { Middleware } = require('../../middleware')
const { AdminUserMiddleware } = require('../../middleware/admin')
router.post('/',Middleware.AdminUserMiddleware.validateCreateUser,Controller.UserController.createUser)
router.get('/',Controller.UserController.getAllUsers)
router.put('/access/:id',Controller.UserController.toggleIsBlocked)
// router.put('/changepassword/:id',AdminUserMiddleware.validateChangePassword,Controller.UserController.)
// router.post('/signout',Controller.AuthController.signOut)

module.exports=router