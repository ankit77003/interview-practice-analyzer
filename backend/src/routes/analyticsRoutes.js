const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { dashboard, analytics, recommendations } = require("../controllers/analyticsController");

const router = express.Router();

router.use(requireAuth);
router.get("/dashboard", dashboard);
router.get("/", analytics);
router.get("/recommendations", recommendations);

module.exports = { analyticsRoutes: router };

