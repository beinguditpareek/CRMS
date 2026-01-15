const { StatusCodes } = require("http-status-codes");
const { User_details } = require("../../models");
const { SuccessResponse, ErrorResponse, DeleteFiles } = require("../../utils/common");

const patchUserDetails = async (req, res) => {
  try {
    const userDetailsId = req.params.id;
    const loggedInUserId = req.user.id; // 🔐 from JWT

    const {
      name,
      email,
      contact,
      designation,
      description,
      school_name,
      school_address,
      school_website_url,
      status
    } = req.body;

    const userDetails = await User_details.findByPk(userDetailsId);

    if (!userDetails) {
      DeleteFiles(req.files);
      ErrorResponse.message = "User_details not found";
      return res.status(StatusCodes.NOT_FOUND).json(ErrorResponse);
    }
     /** 🔥 OWNERSHIP CHECK */
    if (userDetails.user_id !== loggedInUserId) {
      DeleteFiles(req.files);
      ErrorResponse.message = "You are not allowed to update this profile";
      return res.status(StatusCodes.FORBIDDEN).json(ErrorResponse);
    }
    const updatePayload = {
      name,
      email,
      contact,
      designation,
      description,
      school_name,
      school_address,
      school_website_url,
      status
    };

    /** ---------- SCHOOL LOGO ---------- **/
    if (req.files?.school_logo) {
      // purana logo delete
      if (userDetails.school_logo) {
        DeleteFiles({
          school_logo: [{ path: userDetails.school_logo }],
        });
      }

      updatePayload.school_logo = req.files.school_logo[0].path;
    }

    /** ---------- BLOCK ASSETS ---------- **/
    if (req.files?.school_assets) {
      DeleteFiles(req.files);
      ErrorResponse.message = "Use separate API to update school assets";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    await User_details.update(updatePayload, {
      where: { id: userDetailsId },
    });

    SuccessResponse.message = "User_details updated successfully";
    SuccessResponse.data = {};
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    console.log(error)
    DeleteFiles(req.files);
    ErrorResponse.message = "Something went wrong while updating user_details";
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};



const updateUserAssets = async (req, res) => {
  try {
    const userDetailsId = req.params.id;
    const loggedInUserId = req.user.id; // 🔐 from JWT

    const userDetails = await User_details.findByPk(userDetailsId);

    if (!userDetails) {
      DeleteFiles(req.files);
      ErrorResponse.message = "User_details not found";
      return res.status(StatusCodes.NOT_FOUND).json(ErrorResponse);
    }
     /** 🔥 OWNERSHIP CHECK */
    if (userDetails.user_id !== loggedInUserId) {
      DeleteFiles(req.files);
      ErrorResponse.message = "You are not allowed to update this profile";
      return res.status(StatusCodes.FORBIDDEN).json(ErrorResponse);
    }

    if (!req.files?.school_assets) {
      ErrorResponse.message = "No assets provided";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    // purane assets delete
    if (userDetails.school_assets?.length > 0) {
      const oldAssets = userDetails.school_assets.map((path) => ({ path }));
      DeleteFiles({ school_assets: oldAssets });
    }

    const newAssets = req.files.school_assets.map((file) => file.path);

    await User_details.update(
      { school_assets: newAssets },
      { where: { id: userDetailsId } }
    );

    SuccessResponse.message = "School assets updated successfully";
    SuccessResponse.data = {};
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    DeleteFiles(req.files);
    ErrorResponse.message = "Something went wrong while updating assets";
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};



module.exports = { patchUserDetails,updateUserAssets };
