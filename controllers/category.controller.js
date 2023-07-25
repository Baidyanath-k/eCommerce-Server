const slugify = require("slugify");
const Category = require("../models/Category.model");
const { ObjectId } = require("mongodb");

// CREATE CATEGORY || METHOD POST
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(500).json({
        success: false,
        message: "Name is required",
        error: error.message,
      });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(500).json({
        success: false,
        message: "This category already exists",
      });
    }

    const category = await new Category({
      name,
      slug: slugify(name),
    }).save();

    res.status(200).json({
      success: true,
      message: "category save successful",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE CATEGORY || METHOD POST
exports.updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(500).json({
        success: false,
        message: "This category id not found",
        error: error.message,
      });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(500).json({
        success: false,
        message: "This category already exists",
      });
    }

    const result = await category
      .set({
        name,
        slug: slugify(name),
      })
      .save();
    res.status(200).json({
      success: true,
      message: "category update successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// FIND ALL CATEGORY || METHOD GET
exports.allCatagories = async (req, res, next) => {
  try {
    const category = await Category.find({});
    res.status(200).json({
      success: true,
      message: "All category get successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// FIND CATEGORY BY ID || METHOD GET
exports.singleCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    res.status(200).json({
      success: true,
      message: "Single category get successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE SINGLE CATEGORY BY ID || METHOD DELETE
exports.deleteCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteCategory = await Category.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "category delete successfully",
      data: deleteCategory,
    });
  } catch (error) {
    next(error);
  }
};
