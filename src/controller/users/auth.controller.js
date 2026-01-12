const { StatusCodes } = require("http-status-codes");
const { User } = require("../../models");
const { SuccessResponse, ErrorResponse, Utility } = require("../../utils/common");

/* ================= LOGIN ================= */
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailToLowerCase = email.toLowerCase();
    // console.log(emailToLowerCase);
    const getUser = await User.findOne({
      where: {
        email: emailToLowerCase,
      },
    });
    // console.log(getUser);
    if (getUser === null) {
      ErrorResponse.error.message = "Email Doesnot exists";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    const comparePassword = await Utility.comparePassword(
      password,
      getUser.password
    );
    if (!comparePassword) {
      ErrorResponse.error.message = "Invalid Password";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    const jwt = Utility.generateJwtToken({
      id: getUser.id,
      email: getUser.email,
      type: getUser.type,
    });
    const [updateData] = await User.update(
      {
        jwt_token: jwt,
      },
      {
        where: {
          id: getUser.id,
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

/* ================= LOGOUT (STATELESS) ================= */
const signOut = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      ErrorResponse.error.message = "token is missing";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    const getUser = await User.findOne({
      where: {
        jwt_token: token,
      },
    });

    if (!getUser) {
      ErrorResponse.error.message =
        "User Doesnot exists / invalid or expired token";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    await User.update(
      {
        jwt_token: null,
      },
      {
        where: {
          id: getUser.id,
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
