const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = require("./app");

// mongoose database connection
mongoose
  .connect(process.env.MONGODB_ATLAS)
  .then(() => {
    console.log("eCommerce database connection is successfully");
  })
  .catch((error) => {
    console.log("mongodb not connected");
    console.log(error);
  });

app.listen(PORT, () => {
  console.log(`App is running port ${PORT}`);
});
