const orderModel = require("../models/Order.model");

exports.getOrderController = async (req, res, next) => {
  try {
    const order = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.status(200).json({
      success: true,
      message: "Order get successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
