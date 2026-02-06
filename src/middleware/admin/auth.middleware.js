const {Admin} = require('../../models')
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, Utility } = require("../../utils/common");

// const authenticateAdmin = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
     
//       ErrorResponse.message = "Authentication required";
//       return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = Utility.verifyJwtToken(token);

//     const admin = await Admin.findByPk(decoded.id);

//     if (!admin || admin.jwt_token !== token) {
      
//       ErrorResponse.message = "Session expired. Please login again.";
//       return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
//     }

//     if (admin.isBlocked) {
      
//       ErrorResponse.message = "Account blocked";
//       return res.status(StatusCodes.FORBIDDEN).json(ErrorResponse);
//     }

//     req.admin = admin;
//     next();
//   } catch (error) {
    
//     ErrorResponse.message = "Invalid or expired token";
//     return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
//   }
// };
const authenticateAdmin = async (req, res, next) => {
  try {
    let token = null;
    // console.log("REQ COOKIES:", req.cookies);
// console.log("DB TOKEN:", admin?.jwt_token);
// console.log("REQ TOKEN:", token);


    // 🔥 1️⃣ FIRST PRIORITY: Cookie token
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 🔁 2️⃣ FALLBACK: Authorization header (Postman / Mobile)
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    //   console.log("REQ COOKIES:", req.cookies);
    // console.log("FINAL TOKEN:", token);
    // ❌ No token anywhere
    if (!token) {
      ErrorResponse.message = "Authentication required";
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(ErrorResponse);
    }

    // 🔐 Verify JWT
    const decoded = Utility.verifyJwtToken(token);

    const admin = await Admin.findByPk(decoded.id);

    // ❌ Admin not found or session mismatch
    // if (!admin || admin.jwt_token !== token) {
    //   ErrorResponse.message =
    //     "Session expired. Please login again.";
    //   return res
    //     .status(StatusCodes.UNAUTHORIZED)
    //     .json(ErrorResponse);
    // }

    // ❌ Blocked admin
    if (admin.isBlocked) {
      ErrorResponse.message = "Account blocked";
      return res
        .status(StatusCodes.FORBIDDEN)
        .json(ErrorResponse);
    }

    // ✅ Authorized
    req.admin = admin;
    next();
  } catch (error) {
    ErrorResponse.message = "Invalid or expired token";
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(ErrorResponse);
  }
};

const validateAdminResetPassword = async (req, res, next) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;
    const errors = [];

    if (!newPassword) errors.push("New password is missing");
    if (!confirmNewPassword) errors.push("Confirm password is missing");
    if (newPassword !== confirmNewPassword)
      errors.push("Passwords do not match");

    if (errors.length > 0) {
      
      ErrorResponse.message = "Validation failed";
      ErrorResponse.error.explaination = errors;
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    req.hashedPassword = await Utility.encryptedPassword(newPassword);
    next();
  } catch (error) {
    
    ErrorResponse.message = "Password validation failed";
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};


module.exports={
    authenticateAdmin,
validateAdminResetPassword
}