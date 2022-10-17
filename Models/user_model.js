const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    profilePic: { type: String },
    email: { type: String, unique: true, required: true },
    role: { type: Number, required: true },
    cart: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    order: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    favorate: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

exports.User = User;
