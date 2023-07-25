const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

exports.tokenRequireSignIn = async (req, res, next) => {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JSON_TOKEN
    );
    req.user = decode;
    next();
  } catch (error) {
    next(error);
  }
};

exports.tokenAdminVerify = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.user._id });
    if (user.role !== 1) {
      return res.status(500).json({
        status: "False",
        message: "Unauthorized access, You are not admin",
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};
