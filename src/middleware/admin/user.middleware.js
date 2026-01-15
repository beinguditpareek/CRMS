const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, Utility } = require("../../utils/common");
const bcrypt = require("bcrypt");
const { ServerConfig } = require("../../config");
const { User } = require("../../models");

const validateCreateUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const errors = [];
    if (!name) errors.push("Name is missing");
    if (!email) errors.push("Email is missing");
    if (!password) errors.push("Password is missing");

    if (errors.length > 0) {
      ErrorResponse.message = "Validation failed";
      ErrorResponse.error.explaination = errors;
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(ServerConfig.SALT_ROUNDS)
    );
    req.body.password = hashedPassword;

    next();
  } catch (error) {
    // console.log(error);

    ErrorResponse.message =
      "Something went wrong in validateCreateUser Middleware";
    ErrorResponse.error.explaination = error;
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
};

// const validateChangePassword = async (req, res, next) => {
//   try {
//     const userId = req.params.id;
//     console.log(userId)
//     const { oldPassword, newPassword, confirmNewPassword } = req.body;
//     const errors = [];
//     if (!oldPassword) errors.push("Old password is missing");
//     if (!newPassword) errors.push("New password is missing");
//     if (!confirmNewPassword) errors.push("Confirm new password is missing");
//     if (newPassword !== confirmNewPassword)
//       errors.push("New password and confirm password do not match");
//     if (oldPassword === newPassword)
//       errors.push("New password must be different from old password");
    
//     if (errors.length > 0) {
//       ErrorResponse.message = "Validation failed";
//       ErrorResponse.error.explaination = errors;
//       return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
//     }
//     const user = await User.findByPk(userId);
//     if (!user) {
//       ErrorResponse.message = "User not found";
//       return res.status(StatusCodes.NOT_FOUND).json(ErrorResponse);
//     }
//     const isOldPasswordIsCorrect = await Utility.comparePassword(
//       oldPassword,
//       user.password
//     );
//     if (!isOldPasswordIsCorrect) {
//       ErrorResponse.message = "Old password in not correct";
//       return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
//     }

//     const hashedNewPassword = await Utility.encryptedPassword(newPassword);

//     req.user = user;
//     req.hashedPassword = hashedNewPassword;
//     next();
//   } catch (error) {
//     console.log(error)
//     ErrorResponse.message =
//       "Something went wrong in validateChangePassword Middleware";
//     ErrorResponse.error.explaination = error;
//     return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
//   }
// };

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

module.exports = {
  validateCreateUser,
  authenticateUser
  // validateChangePassword
};
