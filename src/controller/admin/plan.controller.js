const { StatusCodes } = require("http-status-codes");
const { Plan } = require("../../models");
const { SuccessResponse, ErrorResponse } = require("../../utils/common");

const createPlan = async (req, res) => {
  try {
    const {
      name,
      features,
      base_price,
      offer_price,
      student_limit,
      team_limit,
      validity,
      status,
    } = req.body;

    if (!name || !base_price || !validity) {
      
      ErrorResponse.message = "Required fields are missing";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    const existingPlan = await Plan.findOne({ where: { name } });
    if (existingPlan) {
      
      ErrorResponse.message = "Plan with this name already exists";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    const plan = await Plan.create({
      name,
      features,
      base_price,
      offer_price,
      student_limit,
      team_limit,
      validity,
      status,
    });

    
    SuccessResponse.message = "Plan created successfully";
    SuccessResponse.data = plan;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    
    ErrorResponse.message = "Something went wrong while creating plan";
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};


const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll({
      order: [["id", "DESC"]],
    });

    
    SuccessResponse.message = "Plans fetched successfully";
    SuccessResponse.data = plans;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    
    ErrorResponse.message = "Something went wrong while fetching plans";
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};


const getPlanById = async (req, res) => {
  try {
    const planId = req.params.id;

    const plan = await Plan.findByPk(planId);

    if (!plan) {
      
      ErrorResponse.message = "Plan not found";
      return res.status(StatusCodes.NOT_FOUND).json(ErrorResponse);
    }

    
    SuccessResponse.message = "Plan fetched successfully";
    SuccessResponse.data = plan;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    
    ErrorResponse.message = "Something went wrong while fetching plan";
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};


const updatePlan = async (req, res) => {
  try {
    const planId = req.params.id;

    const plan = await Plan.findByPk(planId);
    if (!plan) {
      
      ErrorResponse.message = "Plan not found";
      return res.status(StatusCodes.NOT_FOUND).json(ErrorResponse);
    }

    const {
      name,
      features,
      base_price,
      offer_price,
      student_limit,
      team_limit,
      validity,
      status,
    } = req.body;

    await Plan.update(
      {
        name,
        features,
        base_price,
        offer_price,
        student_limit,
        team_limit,
        validity,
        status,
      },
      { where: { id: planId } }
    );

    
    SuccessResponse.message = "Plan updated successfully";
    SuccessResponse.data = {};
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    
    ErrorResponse.message = "Something went wrong while updating plan";
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};


module.exports = {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
};
