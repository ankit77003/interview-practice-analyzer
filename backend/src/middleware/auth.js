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

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET not set in environment");
    }

    console.log("🔑 Token:", token);

    const payload = jwt.verify(token, JWT_SECRET);

    console.log("✅ Verified payload:", JSON.stringify(payload));
    console.log("📍 payload.id:", payload.id);
    console.log("📍 payload.sub:", payload.sub);
    console.log("📍 payload.email:", payload.email);

    req.user = {
      id: payload.id || payload.sub,
      email: payload.email,
      name: payload.name,
    };

    console.log("👤 req.user.id set to:", req.user.id);
    console.log("👤 req.user object:", JSON.stringify(req.user));

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