const express = require("express");
const router = express.Router();

const { Controller } = require("../../controller");
const { Middleware } = require("../../middleware");

router.post(
  "/",
  Middleware.AdminAuthMiddleware.authenticateAdmin,
  Controller.PlanController.createPlan
);

router.get(
  "/",
  Middleware.AdminAuthMiddleware.authenticateAdmin,
  Controller.PlanController.getAllPlans
);

router.get(
  "/:id",
  Middleware.AdminAuthMiddleware.authenticateAdmin,
  Controller.PlanController.getPlanById
);

router.patch(
  "/update/:id",
  Middleware.AdminAuthMiddleware.authenticateAdmin,
  Controller.PlanController.updatePlan
);

module.exports = router;
