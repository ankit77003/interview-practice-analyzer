const express = require("express");
const { signup, login } = require("../controllers/authController");
const { session } = require("passport");
const jwt=require("jsonwebtech");
const router = express.Router();

function createJWT(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    "replace_me_with_a_long_random_string", 
    { expiresIn: "1d" }
  );
}

router.post("/signup", signup);
router.post("/login", login);

// 🔥 Google Auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session:false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    // 🔥 1. Create JWT (you must have this function)
    const token = createJWT(req.user);

    // 🔥 2. Redirect to frontend
    res.redirect(`http://localhost:3000/oauth-success?token=${token}`);
  }
);

// 🍎 Apple Auth
router.get("/apple", passport.authenticate("apple"));

router.post(
  "/apple/callback",
  passport.authenticate("apple", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const token = createJWT(req.user);

    res.redirect(`http://localhost:3000/oauth-success?token=${token}`);
  }
);

module.exports = { authRoutes: router };



