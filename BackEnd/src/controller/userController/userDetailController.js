const User = require("../../models/UserModels/userShema"); // Model người dùng

const userDetail = async (req, res) => {
  try {
    // Lấy thông tin người dùng từ token đã giải mã (req.user được gán từ middleware auth)
    const userId = req.user.id;

    // Tìm người dùng trong cơ sở dữ liệu dựa trên userId
    const user = await User.findById(userId).select("-password"); // Bỏ qua trường mật khẩu khi trả về

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Trả về thông tin người dùng (trừ mật khẩu)
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { userDetail };
