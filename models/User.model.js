const { mongoose } = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Must be enter user name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Must be enter email"],
      unique: [true, "Email address must be unique"],
    },
    password: {
      type: String,
      required: [true, "Your password must be strong"],
    },
    phone: {
      type: String,
      required: [true, "Must be enter phone number"],
      unique: [true, "Phone number must be unique"],
    },
    address: {
      type: String,
      required: [true, "Must be enter address"],
    },
    answer: {
      type: String,
      required: [true, "Must be provide your answer"],
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
