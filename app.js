const express = require("express");
const app = express();
const cors = require("cors");
const authRouter = require("./routes/auth.route");
const categoryRouter = require("./routes/category.route");
const productRouter = require("./routes/product.route");

// middleware
app.use(cors());
app.use(express.json());

// SCHEMA -> MODEL -> QUERY

app.get("/", (req, res) => {
  res.send("eCommerce Route is working");
});

// route
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

module.exports = app;
