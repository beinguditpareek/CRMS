const { StatusCodes } = require("http-status-codes");
const { User, User_details } = require("../../models");
const { SuccessResponse, ErrorResponse } = require("../../utils/common");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const response = await User.create({
      name,
      email,
      password,
      status: false,
    });

    SuccessResponse.message = "User created successfully";
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    if (
      error.name == "SequelizeUniqueConstraintError" ||
      error.name == "SequelizeValidationError"
    ) {
      const err = error.errors.map((e) => {
        return e.message;
      });
      ErrorResponse.messgae = "Something went wrong while register user";
      ErrorResponse.error.explaination = [err];
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
    if (error.name == "SequelizeDatabaseError") {
      ErrorResponse.messgae = "Something went wrong while register user";
      ErrorResponse.error.explaination = [error.original.sqlMessage];
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }

    ErrorResponse.messgae = "Something went wrong";

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.findAll({
      include: {
        model: User_details,
        as: "User_details",
      },
      attributes: {
        exclude: ["password"],
      },
      order: [["id", "DESC"]],
    });

    SuccessResponse.message = "Users fetched successfully";
    SuccessResponse.data = allUsers;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.messgae = "Something went wrong in GetAllUsers";

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

const toggleIsBlocked = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);

    if (!user) {
      ErrorResponse.message = "User Not Found";
      return res.status(StatusCodes.NOT_FOUND).json(ErrorResponse);
    }

    const updateIsBlocked = !user.isBlocked;

    await User.update(
      {
        isBlocked: updateIsBlocked,
      },
      {
        where: {
          id: userId,
        },
      }
    );
    SuccessResponse.message=`User ${updateIsBlocked ? 'Blocked' : 'UnBlocked'} Successfully`
    SuccessResponse.data={
      id:userId,
      isBlocked:updateIsBlocked
    }
    return res.status(StatusCodes.OK).json(SuccessResponse)
  } catch (error) {
     ErrorResponse.messgae = "Something went wrong in toggleIsBlocked";

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

// const changePassword = async(req,res)=>{
//   try {
//     const userId = req.params.id
//     const hashedPassword = req.hashedPassword

//     await User.update(
//       {
//         password:hashedPassword
//     },
//     {
//       where:{
//         id:userId
//       }
//     }
//   )
    
//      SuccessResponse.message = "Password changed successfully";
//     SuccessResponse.data = {};
//     return res.status(StatusCodes.OK).json(SuccessResponse);
//   } catch (error) {
//      ErrorResponse.messgae = "Something went wrong in changePassword";

//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
//   }
// }

module.exports = {
  createUser,
  getAllUsers,
  toggleIsBlocked,
  // changePassword
};
