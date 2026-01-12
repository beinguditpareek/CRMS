const express = require('express')
const router = express.Router()

const { UserController } = require('../../controller')
router.post('/signin',UserController.AuthController.signIn)
router.post('/signout',UserController.AuthController.signOut)

module.exports=router