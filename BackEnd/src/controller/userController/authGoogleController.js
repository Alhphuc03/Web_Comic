const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../../models/UserModels/userShema");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Không có token" });

    // Xác thực token từ Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ username: name, email, avatar: picture });
      await user.save();
    }

    // Tạo JWT cho hệ thống của bạn
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ token: jwtToken });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Lỗi xác thực Google" });
  }
};

module.exports = { verifyGoogleToken };
