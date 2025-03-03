const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/UserModels/userShema");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
          });

          await user.save();
        }

        // ✅ Tạo JWT Token
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET || "secretKey",
          { expiresIn: "1d" }
        );

        return done(null, { user, token }); // ✅ Trả về token trong user object
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
