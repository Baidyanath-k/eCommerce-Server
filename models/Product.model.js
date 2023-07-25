const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Must be provide product name"],
      unique: [true, "Must be provide unique"],
    },
    slug: {
      type: String,
      required: [true, "Must be provide slug"],
    },
    description: {
      type: String,
      required: [true, "Must be provide description"],
    },
    price: {
      type: Number,
      required: [true, "Must be provide price"],
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, "Must be product quantity"],
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
