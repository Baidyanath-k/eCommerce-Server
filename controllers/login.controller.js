const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { comparePassword } = require("../helpers/authPasswordHelper");
exports.createLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(500).json({
        success: false,
        message: "Invalid email and password",
      });
    }

    // check user

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Email is not registered",
      });
    }

    // password matched
    const matchPassword = await comparePassword(password, user.password);
    if (!matchPassword) {
      return res.status(500).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // jWT Token
    const token = await jwt.sign({ _id: user._id }, process.env.JSON_TOKEN, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};
