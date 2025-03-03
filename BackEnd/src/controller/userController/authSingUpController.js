const User = require("../../models/UserModels/userShema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    // Kiểm tra nếu password và confirmPassword không khớp
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Mật khẩu xác nhận không khớp" });
    }

    // Kiểm tra nếu username hoặc email đã tồn tại
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ msg: "Username hoặc email đã tồn tại" });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar: null, // Avatar sẽ là null khi đăng ký
    });

    // Lưu người dùng vào cơ sở dữ liệu
    const savedUser = await newUser.save();

    // Tạo token JWT
    const token = jwt.sign(
      { userId: savedUser._id, username: savedUser.username },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      msg: "Đăng ký thành công",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        avatar: savedUser.avatar, // avatar là null khi đăng ký
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Lỗi máy chủ" });
  }
};

module.exports = { register };
