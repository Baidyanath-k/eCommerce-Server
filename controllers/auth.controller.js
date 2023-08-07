const { hashPassword } = require("../helpers/authPasswordHelper");
const User = require("../models/User.model");

exports.createRegisterController = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    if (!name) {
      return res.status(500).json({
        success: false,
        message: "Name is required",
        error: error.message,
      });
    }
    if (!email) {
      return res.status(500).json({
        success: false,
        message: "Email is required",
        error: error.message,
      });
    }

    if (!password) {
      return res.status(500).json({
        success: false,
        message: "Password is required",
        error: error.message,
      });
    }

    if (!phone) {
      return res.status(500).json({
        success: false,
        message: "Phone is required",
        error: error.message,
      });
    }

    if (!address) {
      return res.status(500).json({
        success: false,
        message: "Address is required",
        error: error.message,
      });
    }
    if (!answer) {
      return res.status(500).json({
        success: false,
        message: "Answer is required",
        error: error.message,
      });
    }

    // check password
    const existingUser = await User.findOne({ email });

    // existing user
    if (existingUser) {
      return res.status(500).json({
        success: false,
        message: "Already register, Please login",
      });
    }

    // password hash
    const hashedPassword = await hashPassword(password);

    // save
    const user = await new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    }).save();

    res.status(200).json({
      success: true,
      message: "User register successful",
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.userGetAllData = async (req, res, next) => {
  try {
    const result = await User.find({});
    res.status(200).json({
      success: true,
      message: "User get successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.testToken = (req, res, next) => {
  res.send("Test successfully");
};

// user private route dashboard controller
exports.userDashBoardController = async (req, res) => {
  try {
    res.status(200).send({
      ok: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "You are not to user, Please login",
    });
  }
};

// admin private route dashboard controller
exports.adminDashBoardController = async (req, res) => {
  try {
    res.status(200).send({
      ok: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "You are not to Admin, Please login",
    });
  }
};

exports.forgotPasswordController = async (req, res, next) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      return res.status(500).json({
        success: false,
        message: "Email is required",
        error: error.message,
      });
    }
    if (!answer) {
      return res.status(500).json({
        success: false,
        message: "Answer is required",
        error: error.message,
      });
    }
    if (!newPassword) {
      return res.status(500).json({
        success: false,
        message: "New Password is required",
        error: error.message,
      });
    }

    // check user
    const user = await User.findOne({ email, answer });
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Wrong email and answer",
        error: error.message,
      });
    }
    const newPasswordHash = await hashPassword(newPassword);

    const response = await User.findByIdAndUpdate(user._id, {
      password: newPasswordHash,
    });

    res.status(200).json({
      success: true,
      message: "Reset successful",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfileController = async (req, res, next) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const user = await User.findById(req.user._id);
    if (password && password >= 6) {
      return res.status(500).json({
        success: false,
        message: "Password is required and at least 6 characters",
        error: error.message,
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "User Profile update successful",
      updateUser,
    });
  } catch (error) {
    next(error);
  }
};
