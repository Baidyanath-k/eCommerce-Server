const express = require("express");
const orderController = require("../controllers/order.controller");
const { tokenRequireSignIn } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/orders", tokenRequireSignIn, orderController.getOrderController);

module.exports = router;
