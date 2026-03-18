const express = require("express");
const cors = require("cors");

const { authRoutes } = require("./routes/authRoutes");
const { problemRoutes } = require("./routes/problemRoutes");
const { analyticsRoutes } = require("./routes/analyticsRoutes");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "256kb" }));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/analytics", analyticsRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  if (err?.code === "P1001") {
    return res.status(503).json({ error: "Database unavailable. Start Postgres and run migrations." });
  }
  return res.status(500).json({ error: "Internal server error" });
});

module.exports = { app };

