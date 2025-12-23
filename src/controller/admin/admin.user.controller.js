const { StatusCodes } = require("http-status-codes");
const { User } = require("../../models");
const { SuccessResponse, ErrorResponse } = require("../../utils/common");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const response = await User.create({
      name,
      email,
      password,
    });

    SuccessResponse.message = "User created successfully";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    // console.log(error);
    if (error.name == "SequelizeUniqueConstraintError") {
      const err = error.errors.map((e) => {
        return e.message;
      });
      ErrorResponse.messgae = "Something went wrong while register user";
      ErrorResponse.error.explaination = err;
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
    ErrorResponse.messgae = "Something went wrong";

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};


const getAllUsers = async (req,res)=>{
    try {
        const allUsers = await User.findAll();
         SuccessResponse.message = "Users fetched successfully";
         SuccessResponse.data=allUsers
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
         ErrorResponse.messgae = "Something went wrong in GetAllUsers";

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports = {
  createUser,
  getAllUsers
};
