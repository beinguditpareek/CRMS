const { StatusCodes } = require("http-status-codes");
const { Transaction, Subscription, Plan, sequelize } = require("../../models");
const { SuccessResponse, ErrorResponse } = require("../../utils/common");
const createTransaction = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { plan_id, payment_method } = req.body;

    if (!plan_id || !payment_method) {
      ErrorResponse.message = "Plan id and payment method are required";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    // 🔍 Check plan
    const plan = await Plan.findOne({
      where: { id: plan_id, status: true },
    });

    if (!plan) {
      ErrorResponse.message = "Plan not found or inactive";
      return res.status(StatusCodes.NOT_FOUND).json(ErrorResponse);
    }

    // 💰 Final price
    const finalAmount = plan.offer_price || plan.base_price;

    // 🧾 Create transaction (PENDING)
    const transaction = await Transaction.create(
      {
        user_id: userId,
        transaction_id: `TXN_${Date.now()}`, // internal reference
        amount: finalAmount,
        currency: "INR",
        payment_method,
        status: "PENDING",
        initiated_at: new Date(),
      },
      { transaction: t }
    );

    await t.commit();

    SuccessResponse.message = "Transaction initiated";
    SuccessResponse.data = {
      transaction_id: transaction.transaction_id,
      amount: transaction.amount,
      plan_id: plan.id,
    };

    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    await t.rollback();
    console.log(error);

    ErrorResponse.message = "Failed to initiate transaction";
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

const completeTransaction = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const {
      internal_transaction_id, // TXN_xxx
      gateway_transaction_id,  // Razorpay / Stripe id
      gateway_response,
      plan_id,
    } = req.body;

    // 🔍 Find transaction
    const transaction = await Transaction.findOne({
      where: {
        transaction_id: internal_transaction_id,
        user_id: userId,
        status: "PENDING",
      },
    });

    if (!transaction) {
      ErrorResponse.message = "Transaction not found or already processed";
      return res.status(StatusCodes.NOT_FOUND).json(ErrorResponse);
    }

    // 🔍 Get plan
    const plan = await Plan.findOne({
      where: { id: plan_id, status: true },
    });

    if (!plan) {
      ErrorResponse.message = "Plan not found";
      return res.status(StatusCodes.NOT_FOUND).json(ErrorResponse);
    }

    // 🔄 Update transaction
    await transaction.update(
      {
        transaction_id: gateway_transaction_id, // real gateway ref
        status: "SUCCESS",
        gateway_response: JSON.stringify(gateway_response),
        completed_at: new Date(),
      },
      { transaction: t }
    );

    // 📅 Subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.validity);

    // 🧾 Create subscription
    const subscription = await Subscription.create(
      {
        user_id: userId,
        plan_id: plan.id,
        start_date: startDate,
        end_date: endDate,
        purchase_price: plan.offer_price || plan.base_price,
        payment_info: gateway_transaction_id,
        status: true, // BOOLEAN ✅
      },
      { transaction: t }
    );

    await t.commit();

    SuccessResponse.message = "Subscription activated successfully";
    SuccessResponse.data = subscription;

    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    await t.rollback();
    console.log(error);

    ErrorResponse.message = "Transaction completion failed";
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};


module.exports={
    createTransaction,completeTransaction
}