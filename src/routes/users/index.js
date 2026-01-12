const express = require('express')
const router = express.Router()
const UserAuthRoutes = require('./auth.routes')
const UserDetailsRoute = require('./user_details.routes')
const UserRoutes = require('./user.routes')

router.use('/auth',UserAuthRoutes)
router.use('/users',UserRoutes)
router.use('/user_details',UserDetailsRoute)


module.exports=router