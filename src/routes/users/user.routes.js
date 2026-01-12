const express = require('express')
const router = express.Router()

const { Controller, UserController } = require('../../controller')
const { AdminUserMiddleware } = require('../../middleware/admin')
const { UserMiddleware } = require('../../middleware')

router.put('/changepassword/:id',
    UserMiddleware.UserMiddleware.authenticateUser,
    UserMiddleware.UserMiddleware.validateChangePassword,
    UserController.UserController.changePassword)

module.exports=router