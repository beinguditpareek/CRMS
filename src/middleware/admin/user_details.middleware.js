const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../../utils/common");

const validateCreateUserDetails = async (req, res, next) => {
  try {
    const { name, email, user_id, contact, designation, school_website_url } =
      req.body;
    const { school_assets, school_logo } = req.files;
    const errors = [];
    if (!name) errors.push("Name is missing");
    if (!email) errors.push("Email is missing");
    if (!user_id) errors.push("User_id is missing");
    if (!contact) errors.push("contact is missing");
    if (!designation) errors.push("designation is missing");
    if (!school_website_url) errors.push("school_website_url is missing");
    if (!school_logo) errors.push("school_logo is missing");
    if (!school_assets) errors.push("school_assets is missing");

    if (errors.length > 0) {
      ErrorResponse.message = "Validation failed";
      ErrorResponse.error.explaination = errors;
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    next();
  } catch (error) {
    // console.log(error);

    ErrorResponse.message =
      "Something went wrong in validateCreateUserDetails Middleware";
    ErrorResponse.error.explaination = error;
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
};

module.exports = {
  validateCreateUserDetails,
};
