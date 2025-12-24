const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../../utils/common");
const bcrypt = require("bcrypt");
const { ServerConfig } = require("../../config");

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
    console.log(error);

    ErrorResponse.message =
      "Something went wrong in validateCreateUser Middleware";
    ErrorResponse.error.explaination = error;
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
};

module.exports = {
  validateCreateUser,
};
