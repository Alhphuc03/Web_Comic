const User = require("../../models/UserModels/userShema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    // Tìm người dùng theo username hoặc email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(400).json({ msg: "Tên đăng nhập hoặc email sai" });
    }

    // So sánh mật khẩu đã nhập với mật khẩu được mã hóa
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Tạo token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "7d" } // Token có hạn 7 ngày
    );

    res.json({
      msg: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avt: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { login };
