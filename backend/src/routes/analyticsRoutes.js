const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { dashboard, analytics, recommendations } = require("../controllers/analyticsController");
const { getStrategy } = require("../controllers/strategyController");
const {getPlannerTasks, updatePlannerTask} = require("../controllers/plannerController");

const router = express.Router();

router.use(requireAuth);
router.get("/dashboard", dashboard);
router.get("/", analytics);
router.get("/recommendations", recommendations);
router.get("/strategy", getStrategy);
router.get("/planner-tasks", getPlannerTasks);
router.patch("/planner-tasks/:taskId", updatePlannerTask);

module.exports = router;

