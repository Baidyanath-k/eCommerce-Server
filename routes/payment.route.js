const express = require("express");
const paymentController = require("../controllers/payment.controller");
const { tokenRequireSignIn } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/braintree/token", paymentController.braintreeTokenController);
router.post(
  "/braintree/payment",
  tokenRequireSignIn,
  paymentController.braintreePaymentController
);

module.exports = router;
