// backend/routes/auth.js
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { prisma } = require("../prismaClient");

const { signup, login } = require("../controllers/authController");

const router = express.Router();

// 🔐 Create JWT helper
function createJWT(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET || "mysecretkey123", // ⚠️ use env in production
    { expiresIn: "7d" }
  );
}

// ==========================
// 🔹 Normal Auth
// ==========================
router.post("/signup", signup);
router.post("/login", login);

// ==========================
// 🔥 Google OAuth
// ==========================

// Step 1: Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Callback from Google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  async (req, res) => {
    try {
      let user = await prisma.user.findUnique({
        where: { email: req.user.email },
      });

      // 🔥 CREATE USER IF NOT EXISTS
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: req.user.email,
            passwordHash: "oauth", // dummy
          },
        });
      }

      const token = createJWT(user);

      res.redirect(`http://localhost:5173/login?token=${token}`);

    } catch (err) {
      console.error("OAuth error:", err);
      res.redirect("http://localhost:5173/login");
    }
  }
);

// ==========================
// 🍎 Apple OAuth
// ==========================

// Step 1: Redirect to Apple
router.get(
  "/apple",
  passport.authenticate("apple", { scope: ["name", "email"] })
);

// Step 2: Callback from Apple
router.post(
  "/apple/callback",
  passport.authenticate("apple", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const token = createJWT(req.user);

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

// ==========================
// ✅ EXPORT
// ==========================
module.exports = router;