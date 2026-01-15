const express = require('express')
const router = express.Router()
const AdminAuthRoutes = require('./auth.routes')
const AdminUserRoutes = require('./users.route')
const AdminUserDetailsRoutes = require('./user_details.route')
const AdminPlanRoutes = require ('./plan.routes')
router.use('/auth',AdminAuthRoutes)
router.use('/users',AdminUserRoutes)
router.use('/user_details',AdminUserDetailsRoutes)
router.use('/plan',AdminPlanRoutes)

module.exports=router