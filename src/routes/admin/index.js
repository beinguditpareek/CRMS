const express = require('express')
const router = express.Router()
const AdminAuthRoutes = require('./admin.auth.routes')
const AdminUserRoutes = require('./admin.users.route')
router.use('/auth',AdminAuthRoutes)
router.use('/users',AdminUserRoutes)

module.exports=router