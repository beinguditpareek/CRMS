const { StatusCodes } = require("http-status-codes");
const { User_details } = require("../../models");
const { SuccessResponse, ErrorResponse, DeleteFiles } = require("../../utils/common");

const createUserDetails = async (req, res) => {
  try {
    const { user_id } = req.body;

    
    const alreadyExists = await User_details.findOne({
      where: { user_id },
    });

    if (alreadyExists) {
      DeleteFiles(req.files);
      ErrorResponse.message = "User details already exist for this user";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    const {
      name,
      email,
      contact,
      designation,
      school_name,
      school_address,
      school_website_url,
    } = req.body;

    const school_logo = req.files?.school_logo
      ? req.files.school_logo[0].path
      : null;

    const school_assets = req.files?.school_assets
      ? req.files.school_assets.map((file) => file.path)
      : [];

    const response = await User_details.create({
      user_id,
      name,
      email,
      contact,
      designation,
      school_name,
      school_address,
      school_logo,
      school_website_url,
      school_assets,
      status: true,
    });

    SuccessResponse.message = "User details created successfully";
    SuccessResponse.data = response;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    DeleteFiles(req.files);

    
    if (error.name === "SequelizeUniqueConstraintError") {
      ErrorResponse.message = "User details already exist for this user";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    ErrorResponse.message = "Something went wrong";
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};


const getAllUserDetails = async (req,res)=>{
    try {
        const allUsers = await User_details.findAll({
            // attributes:{
            //     exclude:['password']
            // },
            order:[
                ['id','DESC']
            ]
        });

         SuccessResponse.message = "User_details fetched successfully";
         SuccessResponse.data=allUsers
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
         ErrorResponse.messgae = "Something went wrong in GetAllUsersDetails";

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}
const deleteUserDetails = async (req,res)=>{
    try {
        const userId = req.params.id
        const userToDelete = await User_details.destroy({
           where:{
            id: userId
           }
        });

         SuccessResponse.message = "User_details Deleted successfully";
         SuccessResponse.data=userToDelete
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
         ErrorResponse.messgae = "Something went wrong in deleteAllUserDEtails";

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}






module.exports = {
  createUserDetails,
  getAllUserDetails,
  deleteUserDetails
};
