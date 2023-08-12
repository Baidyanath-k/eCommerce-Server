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

exports.getAllOrderController = async (req, res, next) => {
  try {
    const allOrder = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createAt: "-1" });
    res.status(200).json({
      success: true,
      message: "All order get successfully",
      data: allOrder,
    });
  } catch (error) {
    next(error);
  }
};

exports.orderStatusController = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orderStatus = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Order Status Update successfully",
      data: orderStatus,
    });
  } catch (error) {
    next(err);
  }
};
