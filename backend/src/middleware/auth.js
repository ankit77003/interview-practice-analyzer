const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";

    console.log("🔐 Auth Header:", header);

    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        error: "Missing or invalid Authorization header",
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey123";

    const payload = jwt.verify(token, JWT_SECRET);

    console.log("✅ Verified payload:", payload);

    if (!payload.id) {
      return res.status(401).json({
        error: "Invalid token payload (missing id)",
      });
    }

    req.user = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    };

    console.log("👤 req.user:", req.user);

    next();
  } catch (err) {
    console.error("❌ Auth error:", err.message);

    return res.status(401).json({
      error:
        err.name === "TokenExpiredError"
          ? "Token expired"
          : "Invalid token",
    });
  }
}

module.exports = { requireAuth };