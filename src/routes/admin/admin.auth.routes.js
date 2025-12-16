const express = require('express')
const router = express.Router()

const { Controller } = require('../../controller')
router.post('/signin',Controller.AuthController.signIn)
router.post('/signout',Controller.AuthController.signOut)

module.exports=router