const express = require('express')
const router = express.Router()
const AdminRoutes = require('./admin')
router.use('/admin',AdminRoutes)

module.exports=router