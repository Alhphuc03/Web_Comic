const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization");

  // Kiểm tra xem token có tồn tại không
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Lấy token thực tế (phần sau "Bearer ")
    const tokenValue = token.split(" ")[1];

    // Giải mã token
    const decoded = jwt.verify(
      tokenValue,
      process.env.JWT_SECRET || "secretKey"
    );

    // Lưu thông tin người dùng vào request
    req.user = decoded;
    next(); // Tiếp tục đến middleware hoặc route tiếp theo
  } catch (e) {
    // Xử lý các loại lỗi khác nhau
    if (e.name === "JsonWebTokenError") {
      return res.status(400).json({ msg: "Token is not valid" });
    }
    if (e.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token has expired" });
    }
    res.status(500).json({ msg: "Server error" }); // Lỗi không xác định
  }
};

module.exports = auth;
