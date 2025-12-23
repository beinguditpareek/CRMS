const express = require('express')
const router = express.Router()
const Multer = require('../../utils/common')
const { Controller } = require('../../controller')
router.post('/create', Multer.upload.fields([
    { name: "school_logo", maxCount: 1 },
    { name: "school_assets", maxCount: 5 },
  ]),Controller.UserDetailsController.createUserDetails)


module.exports=router