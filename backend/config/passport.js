const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: "GOOGLE_CLIENT_ID",
      clientSecret: "GOOGLE_SECRET",
      callbackURL: "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // 🔥 Here you get user info
      console.log(profile);
      return done(null, profile);
    }
  )
);
