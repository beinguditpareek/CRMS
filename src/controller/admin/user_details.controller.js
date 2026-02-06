const { StatusCodes } = require("http-status-codes");
const { User_details, User } = require("../../models");
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
      description,
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
      description,
      school_name,
      school_address,
      school_logo,
      school_website_url,
      school_assets,
      status: true,
    });
    await User.update({ status: true }, { where: { id: user_id } });


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


const patchUserDetailsByAdmin = async (req, res) => {
  try {
    const userDetailsId = req.params.id;
    const adminId = req.admin.id; // 🔐 logged-in admin

    const {
      name,
      email,
      contact,
      designation,
      description,
      school_name,
      school_address,
      school_website_url,
      status,
    } = req.body || {};

    const userDetails = await User_details.findByPk(userDetailsId);

    if (!userDetails) {
      DeleteFiles(req.files);
      const errRes = ErrorResponse();
      errRes.message = "User details not found";
      return res.status(StatusCodes.NOT_FOUND).json(errRes);
    }

    /** ❌ NO OWNERSHIP CHECK (ADMIN OVERRIDE) */

    const updatePayload = {
      name,
      email,
      contact,
      designation,
      description,
      school_name,
      school_address,
      school_website_url,
      status,
    };

    /** ---------- SCHOOL LOGO ---------- **/
    if (req.files?.school_logo) {
      if (userDetails.school_logo) {
        DeleteFiles({
          school_logo: [{ path: userDetails.school_logo }],
        });
      }
      updatePayload.school_logo = req.files.school_logo[0].path;
    }

    /** ---------- BLOCK ASSETS (SEPARATE API) ---------- **/
    if (req.files?.school_assets) {
      DeleteFiles(req.files);
      
      ErrorResponse.message = "Use separate API to update school assets";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    await User_details.update(updatePayload, {
      where: { id: userDetailsId },
    });

   
    SuccessResponse.message = "User details updated successfully by admin";
    SuccessResponse.data = {};
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    DeleteFiles(req.files);
    
    ErrorResponse.message =
      "Something went wrong while admin updating user details";
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};



const updateUserAssetsByAdmin = async (req, res) => {
  try {
    const userDetailsId = req.params.id;
    const adminId = req.admin.id; // 🔐 logged-in admin (for audit if needed)

    const userDetails = await User_details.findByPk(userDetailsId);

    if (!userDetails) {
      DeleteFiles(req.files);
            ErrorResponse.message = "User details not found";
      return res.status(StatusCodes.NOT_FOUND).json(ErrorResponse);
    }

    /** ❌ NO OWNERSHIP CHECK (ADMIN OVERRIDE) */

    if (!req.files?.school_assets) {
            ErrorResponse.message = "No assets provided";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    /** ---------- DELETE OLD ASSETS ---------- **/
    if (userDetails.school_assets?.length > 0) {
      const oldAssets = userDetails.school_assets.map((path) => ({ path }));
      DeleteFiles({ school_assets: oldAssets });
    }

    /** ---------- SAVE NEW ASSETS ---------- **/
    const newAssets = req.files.school_assets.map((file) => file.path);

    await User_details.update(
      { school_assets: newAssets },
      { where: { id: userDetailsId } }
    );

   
    SuccessResponse.message = "School assets updated successfully by admin";
    SuccessResponse.data = {};
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    DeleteFiles(req.files);
        ErrorResponse.message = "Something went wrong while admin updating assets";
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};



// module.exports = { patchUserDetails,updateUserAssets };


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
const getSingleUserDetailByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ["password", "jwt_token"],
      },
      include: {
        model: User_details,
        as: "User_details",
      },
    });

    if (!user) {
      ErrorResponse.message = "User not found";
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(ErrorResponse);
    }

    SuccessResponse.message = "User details fetched successfully";
    SuccessResponse.data = user;
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse);
  } catch (error) {
    console.log(error);

    ErrorResponse.message =
      "Something went wrong while fetching user details";
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

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
  getSingleUserDetailByAdmin,
  deleteUserDetails,
  patchUserDetailsByAdmin,
  updateUserAssetsByAdmin
};
