const { StatusCodes } = require("http-status-codes");
const { Admin } = require("../../models");
const {
  ErrorResponse,
  Utility,
  SuccessResponse,
} = require("../../utils/common");

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailToLowerCase = email.toLowerCase();
    // console.log(emailToLowerCase);
    const getAdmin = await Admin.findOne({
      where: {
        email: emailToLowerCase,
      },
    });
    // console.log(getAdmin);
    if (getAdmin === null) {
      ErrorResponse.error.message = "Email Doesnot exists";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    const comparePassword = await Utility.comparePassword(
      password,
      getAdmin.password
    );
    if (!comparePassword) {
      ErrorResponse.error.message = "Invalid Password";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    const jwt = Utility.generateJwtToken({
      id: getAdmin.id,
      email: getAdmin.email,
      type: getAdmin.type,
    });
    const [updateData] = await Admin.update(
      {
        jwt_token: jwt,
      },
      {
        where: {
          id: getAdmin.id,
        },
      }
    );
    if (!updateData) {
      ErrorResponse.error.message = "jwt is not updated";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    SuccessResponse.data = jwt;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error.message = "Internal server error";
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

const signOut = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      ErrorResponse.error.message = "token is missing";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    const getAdmin = await Admin.findOne({
      where: {
        jwt_token: token,
      },
    });

    if (!getAdmin) {
      ErrorResponse.error.message =
        "Admin Doesnot exists / invalid or expired token";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    await Admin.update(
      {
        jwt_token: null,
      },
      {
        where: {
          id: getAdmin.id,
        },
      }
    );

    SuccessResponse.message = "logout successfull";
    SuccessResponse.data={}
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error.message = "Internal server error";
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

module.exports = {
  signIn,
  signOut,
};
