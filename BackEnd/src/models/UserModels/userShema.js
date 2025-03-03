const mongoose = require("mongoose");

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
    },
  },
  { collection: "Users" }
); // Chỉ định tên collection

// Tạo model User từ schema
const User = mongoose.model("User", userSchema);

module.exports = User;
