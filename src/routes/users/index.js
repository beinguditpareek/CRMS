const express = require('express')
const router = express.Router()
const UserAuthRoutes = require('./auth.routes')
const UserDetailsRoute = require('./user_details.routes')
const UserRoutes = require('./user.routes')
const TransactionRoutes = require('./transaction.routes')

router.use('/auth',UserAuthRoutes)
router.use('/users',UserRoutes)
router.use('/user_details',UserDetailsRoute)
router.use('/transaction',TransactionRoutes)


module.exports=router