const express = require("express");
const orderController = require("../controllers/order.controller");
const {
  tokenRequireSignIn,
  tokenAdminVerify,
} = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/orders", tokenRequireSignIn, orderController.getOrderController);

router.get(
  "/all-orders",
  tokenRequireSignIn,
  tokenAdminVerify,
  orderController.getAllOrderController
);
router.put(
  "/order-status/:orderId",
  tokenRequireSignIn,
  tokenAdminVerify,
  orderController.orderStatusController
);

module.exports = router;
