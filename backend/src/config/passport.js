require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      // 🔥 You can store user in DB here
      return done(null, {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
      });
    }
  )
);

module.exports = passport;