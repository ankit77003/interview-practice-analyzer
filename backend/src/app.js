const express = require("express");
const cors = require("cors");

const { authRoutes } = require("./routes/authRoutes");
const { problemRoutes } = require("./routes/problemRoutes");
const { analyticsRoutes } = require("./routes/analyticsRoutes");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "256kb" }));
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/analytics", analyticsRoutes);

// Enhanced error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  // Handle JSON parse errors
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Bad Request: Invalid JSON" });
  }
  
  // Handle Prisma errors
  if (err?.code === "P2002") {
    return res.status(409).json({ error: "Conflict: Unique constraint violation" });
  }
  if (err?.code === "P2025") {
    return res.status(404).json({ error: "Not Found: Record does not exist" });
  }
  if (err?.code === "P1001") {
    return res.status(503).json({ error: "Database unavailable. Start Postgres and run migrations." });
  }
  
  // Default error
  return res.status(500).json({ error: "Internal server error" });
});

module.exports = { app };