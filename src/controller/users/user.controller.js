const { StatusCodes } = require("http-status-codes");
const { User, User_details } = require("../../models");
const { SuccessResponse, ErrorResponse } = require("../../utils/common");


const changePassword = async(req,res)=>{
  try {
    const userId = req.params.id
    const hashedPassword = req.hashedPassword

    await User.update(
      {
        password:hashedPassword
    },
    {
      where:{
        id:userId
      }
    }
  )
    
     SuccessResponse.message = "Password changed successfully";
    SuccessResponse.data = {};
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
     ErrorResponse.messgae = "Something went wrong in changePassword";

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

module.exports={
    changePassword
}