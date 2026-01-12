const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, Utility } = require("../../utils/common");
const bcrypt = require("bcrypt");
const { ServerConfig } = require("../../config");
const { User } = require("../../models");




const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ErrorResponse.message = "Authentication required";
      return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
    }

    const token = authHeader.split(" ")[1];
    const decoded = Utility.verifyJwtToken(token);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      ErrorResponse.message = "User not found";
      return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
    }

    // 🔥 MAIN FIX — TOKEN MATCH
    if (!user.jwt_token || user.jwt_token !== token) {
      ErrorResponse.message = "Session expired. Please login again.";
      return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
    }

    if (user.isBlocked) {
      ErrorResponse.message = "Account blocked";
      return res.status(StatusCodes.FORBIDDEN).json(ErrorResponse);
    }

    req.user = user;
    next();
  } catch (error) {
    ErrorResponse.message = "Invalid or expired token";
    return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
  }
};






const validateChangePassword = async (req, res, next) => {
  try {
    // 🔐 logged-in user (authenticateUser middleware se)
    const user = req.user;

    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const errors = [];

    if (!oldPassword) errors.push("Old password is missing");
    if (!newPassword) errors.push("New password is missing");
    if (!confirmNewPassword) errors.push("Confirm new password is missing");
    if (newPassword !== confirmNewPassword)
      errors.push("New password and confirm password do not match");
    if (oldPassword === newPassword)
      errors.push("New password must be different from old password");

    if (errors.length > 0) {
      
      ErrorResponse.message = "Validation failed";
      ErrorResponse.error.explaination = errors;
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    if (!user) {
     
      ErrorResponse.message = "User not found";
      return res.status(StatusCodes.NOT_FOUND).json(ErrorResponse);
    }

    const isOldPasswordCorrect = await Utility.comparePassword(
      oldPassword,
      user.password
    );

    if (!isOldPasswordCorrect) {
     
      ErrorResponse.message = "Old password is not correct";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    // 🔐 hash new password
    const hashedNewPassword = await Utility.encryptedPassword(newPassword);

    req.hashedPassword = hashedNewPassword;
    next();
  } catch (error) {
    // console.log(error);
    
    ErrorResponse.message =
      "Something went wrong in validateChangePassword middleware";
    ErrorResponse.error.explaination = [error.message];
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};



module.exports={
    authenticateUser,
    validateChangePassword
}
