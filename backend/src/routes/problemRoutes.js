const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { createProblem, listProblems } = require("../controllers/problemController");

const router = express.Router();

router.use(requireAuth);
router.get("/", listProblems);
router.post("/", createProblem);

module.exports = router;

