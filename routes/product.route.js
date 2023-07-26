const express = require("express");
const {
  tokenRequireSignIn,
  tokenAdminVerify,
} = require("../middlewares/authMiddleware");
const productController = require("../controllers/product.controller");
const formidable = require("express-formidable");
const router = express.Router();

// CREATE PRODUCT || METHOD POST
router.post(
  "/create-product",
  tokenRequireSignIn,
  tokenAdminVerify,
  formidable(),
  productController.createProduct
);

// UPDATE SINGLE PRODUCT PHOTO BY ID || METHOD PUT
router.patch(
  "/update-product/:id",
  tokenRequireSignIn,
  tokenAdminVerify,
  productController.updateProductController
);

// GET PRODUCT || METHOD GET
router.get("/get-products", productController.gatProductController);

// GET SINGLE PRODUCT BY ID || METHOD GET
router.get("/get-product/:id", productController.getSingleProductById);

// GET SINGLE PRODUCT PHOTO BY ID || METHOD GET
router.get(
  "/get-product-photo/:id",
  productController.getProductPhotoController
);

// DELETE SINGLE PRODUCT PHOTO BY ID || METHOD DELETE
router.delete(
  "/delete-product/:id",
  tokenRequireSignIn,
  tokenAdminVerify,
  productController.deleteProductController
);

// FILTER BY PRODUCT || METHOD POST
router.post("/filter-product", productController.filterByProduct);

module.exports = router;
