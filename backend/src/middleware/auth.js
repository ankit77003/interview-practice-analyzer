const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token in Authorization header
 * Expected format: "Authorization: Bearer <token>"
 */
function requireAuth(req, res, next) {
  const header = req.header("authorization") || "";
  const [scheme, token] = header.split(" ");

  // ✅ Validate Authorization scheme and token
  if (scheme !== "Bearer" || !token) {
    console.error("❌ Missing or invalid Authorization header:", { scheme, hasToken: !!token });
    return res.status(401).json({ 
      error: "Missing or invalid Authorization header. Expected: 'Authorization: Bearer <token>'" 
    });
  }

  try {
    // ✅ Verify JWT token using secret
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified for user:", payload.email);
    
    // Attach user info to request
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    
    // ✅ Distinguish between expired and invalid tokens
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired. Please login again." });
    }
    
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };