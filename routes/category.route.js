const express = require("express");
const {
  tokenRequireSignIn,
  tokenAdminVerify,
} = require("../middlewares/authMiddleware");
const categoryController = require("../controllers/category.controller");
const router = express.Router();

// CREATE CATEGORY || METHOD POST
router.post(
  "/categories",
  tokenRequireSignIn,
  tokenAdminVerify,
  categoryController.createCategory
);

// UPDATE CATEGORY || METHOD PATCH
router.patch(
  "/updateCategory/:id",
  tokenRequireSignIn,
  tokenAdminVerify,
  categoryController.updateCategory
);

// FIND ALL CATEGORY || METHOD GET
router.get("/catagories", categoryController.allCatagories);

// FIND SINGLE CATEGORY BY SLUG || METHOD GET
router.get("/catagory/:slug", categoryController.singleCategory);

// DELETE SINGLE CATEGORY BY ID || METHOD DELETE
router.delete(
  "/delete-category/:id",
  tokenRequireSignIn,
  tokenAdminVerify,
  categoryController.deleteCategoryById
);

module.exports = router;
