const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModels/userShema");
require("dotenv").config();

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token không hợp lệ!" });
    }

    // ✅ Xác thực token từ Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    // ✅ Kiểm tra người dùng có tồn tại chưa
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ username: name, email, avatar: picture });

      try {
        await user.save();
        console.log("✅ User đã lưu vào DB:", user);
      } catch (saveError) {
        console.error("❌ Lỗi khi lưu User vào DB:", saveError);
        return res.status(500).json({ message: "Lỗi khi lưu User vào DB" });
      }
    } else {
      console.log("📌 User đã tồn tại:", user);
    }

    // ✅ Tạo JWT token
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "1d" }
    );

    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error("❌ Lỗi xác thực Google:", error);
    res.status(500).json({ message: "Lỗi xác thực Google!" });
  }
});

module.exports = router;
