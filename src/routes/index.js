const express = require('express')
const router = express.Router()
const AdminRoutes = require('./admin')
const UserRoutes = require('./users')
router.use('/admin',AdminRoutes)
router.use('/user',UserRoutes)

module.exports=router