const slugify = require("slugify");
const productModel = require("../models/Product.model");
const formidable = require("express-formidable");
const fs = require("fs");
const Category = require("../models/Category.model");

// CREATE PRODUCT CONTROLLER || METHOD POST CONTROLLER
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;

    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const verify = await productModel.findOne({ name });
    if (verify) {
      return res.status(500).json({
        success: false,
        message: "Already upload this name product, Please provide unique",
      });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    const product = await products.save();

    res.status(200).json({
      success: true,
      message: "Product save successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCT CONTROLLER || METHOD GET CONTROLLER
exports.gatProductController = async (req, res, next) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      // .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Products get successfully",
      countTotal: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE PRODUCT CONTROLLER || METHOD GET CONTROLLER
exports.getSingleProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const singleProduct = await productModel
      .findById(id)
      .select("-photo")
      .populate("category");

    res.status(200).json({
      success: true,
      message: "Product save successfully",
      data: singleProduct,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE PRODUCT CONTROLLER || METHOD GET CONTROLLER
exports.getSingleProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const singleProductSlug = await productModel
      .findById({ slug })
      .select("-photo")
      .populate("category");

    res.status(200).json({
      success: true,
      message: "Product save successfully",
      data: singleProductSlug,
    });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCT PHOTO CONTROLLER || METHOD GET CONTROLLER
exports.getProductPhotoController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productPhoto = await productModel.findById(id).select("photo");
    if (productPhoto.photo.data) {
      res.set("Content-type", productPhoto.photo.contentType);
      return res.status(200).send(productPhoto.photo.data);
    }
  } catch (error) {
    next(error);
  }
};

// DELETE PRODUCT CONTROLLER || METHOD DELETE CONTROLLER
exports.deleteProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteProduct = await productModel.deleteOne({ _id: id });

    if (!deleteProduct.deletedCount) {
      return res.status(500).json({
        success: false,
        message: "This id not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Delete Product Successfully",
      data: deleteProduct,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProductController = async (req, res, next) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.body;
    // const { photo } = req.files;
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(500).json({
        success: false,
        message: "This product id not found",
      });
    }

    const result = await product
      .set({
        name,
        description,
        price,
        category,
        quantity,
        shipping,
        slug: slugify(name),
      })
      .save();
    res.status(200).json({
      success: true,
      message: "product update successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Product filter || Method Post
exports.filterByProduct = async (req, res, next) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// PRODUCT COUNT || METHOD GET
exports.productCount = async (req, res, next) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).json({
      success: true,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// PRODUCT LIST BASE ON PAGE || METHOD GET
exports.productListController = async (req, res, next) => {
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;

    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

//SEARCH PRODUCT || METHOD GET
exports.searchProductController = async (req, res, next) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    next(error);
  }
};

//similar PRODUCT || METHOD GET
exports.similarProductController = async (req, res, next) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({ category: cid, _id: { $ne: pid } })
      .select("-photo")
      .limit(6);
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCT BY CATEGORY CONTROLLER || METHOD GET CONTROLLER
exports.productCategoryController = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).json({
      success: true,
      category,
      products,
    });
  } catch (error) {
    next(error);
  }
};
