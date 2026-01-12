const express = require('express')
const router = express.Router()
const Multer = require('../../utils/common')

const { UserController } = require('../../controller')
router.patch('/update/:id',
     Multer.upload.fields([{ name: "school_logo", maxCount: 1 },{ name: "school_assets", maxCount: 10 },]),
     UserController.UserDetailsController.patchUserDetails)
router.put('/update/assets/:id',
         Multer.upload.fields([{ name: "school_logo", maxCount: 1 },{ name: "school_assets", maxCount: 10 },]),

    UserController.UserDetailsController.updateUserAssets)

module.exports=router