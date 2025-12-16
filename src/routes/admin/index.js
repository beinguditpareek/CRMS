const express = require('express')
const router = express.Router()
const AdminAuthRoutes = require('./admin.auth.routes')
router.use('/auth',AdminAuthRoutes)

module.exports=router