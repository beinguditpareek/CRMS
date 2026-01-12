const express = require('express')
const router = express.Router()
const AdminAuthRoutes = require('./auth.routes')
const AdminUserRoutes = require('./users.route')
const AdminUserDetailsRoutes = require('./user_details.route')
router.use('/auth',AdminAuthRoutes)
router.use('/users',AdminUserRoutes)
router.use('/user_details',AdminUserDetailsRoutes)

module.exports=router