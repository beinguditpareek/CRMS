const express = require('express')
const router = express.Router()

const { Controller } = require('../../controller')
const { Middleware } = require('../../middleware')
router.post('/',Middleware.AdminUserMiddleware.validateCreateUser,Controller.UserController.createUser)
router.get('/',Controller.UserController.getAllUsers)
// router.post('/signout',Controller.AuthController.signOut)

module.exports=router