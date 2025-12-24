const { StatusCodes } = require("http-status-codes");
const { User_details } = require("../../models");
const { SuccessResponse, ErrorResponse, DeleteFiles } = require("../../utils/common");

const createUserDetails = async (req, res) => {
  try {
    const {
      user_id,
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

    console.log(
      "school_assets type:",
      User_details.rawAttributes.school_assets.type.key
    );

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

    SuccessResponse.message = "User_details created successfully";
    SuccessResponse.data = response;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    // console.log(error);
    DeleteFiles(req.files)
    if (
      error.name == "SequelizeUniqueConstraintError" ||
      error.name == "SequelizeValidationError"
    ) {
      const err = error.errors.map((e) => {
        return e.message;
      });
      ErrorResponse.messgae = "Something went wrong while register user";
      ErrorResponse.error.explaination = [err];
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
    if (
      error.name == "SequelizeDatabaseError" ||
      error.name == "SequelizeForeignKeyConstraintError"
    ) {
      ErrorResponse.messgae = "Something went wrong while register user";
      ErrorResponse.error.explaination = [error.original.sqlMessage];
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }

    ErrorResponse.messgae = "Something went wrong";

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
