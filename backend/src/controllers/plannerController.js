const PlannerTask = require("../models/PlannerTask");
const Problem = require("../models/Problem");
const {
  generateStrategy,
} = require("../services/aiStrategyService");

// Get or create roadmap tasks
async function getPlannerTasks(req, res) {
  try {
    const userId = req.user.id;

    let tasks = await PlannerTask.find({ userId }).sort({
      phase: 1,
      createdAt: 1,
    });

    if (tasks.length === 0) {
      const problems = await Problem.find({ userId })
        .select("topic difficulty timeTaken status")
        .lean();

      if (problems.length === 0) {
        return res.json({ tasks: [] });
      }

      // Reuse your existing strategy generator.
      const topicStats = new Map();

      for (const problem of problems) {
        const stats = topicStats.get(problem.topic) || {
          attempts: 0,
          solved: 0,
          solvedTimeSum: 0,
          solvedTimeCount: 0,
        };

        stats.attempts++;

        if (problem.status === "SOLVED") {
          stats.solved++;
          stats.solvedTimeSum += problem.timeTaken || 0;
          stats.solvedTimeCount++;
        }

        topicStats.set(problem.topic, stats);
      }

      const topicInsights = [...topicStats.entries()].map(
        ([topic, stats]) => {
          const accuracy = stats.solved / stats.attempts;

          const averageTime = stats.solvedTimeCount
            ? stats.solvedTimeSum / stats.solvedTimeCount
            : null;

          return {
            topic,
            attempts: stats.attempts,
            solved: stats.solved,
            accuracy: Math.round(accuracy * 1000) / 10,
            averageTime,
          };
        }
      );

      const analyticsData = {
        weakestTopic:
          topicInsights.sort(
            (a, b) => a.accuracy - b.accuracy
          )[0]?.topic || null,
        topicInsights,
        totalProblems: problems.length,
        solvedProblems: problems.filter(
          (p) => p.status === "SOLVED"
        ).length,
      };

      const strategy = await generateStrategy(analyticsData);

      const generatedTasks = (
        strategy.practiceSequence || []
      ).map((step, index) => ({
        userId,
        title: step,
        topic: strategy.topic || "General DSA",
        phase: index + 1,
      }));

      if (generatedTasks.length > 0) {
        await PlannerTask.insertMany(generatedTasks);
      }

      tasks = await PlannerTask.find({ userId }).sort({
        phase: 1,
      });
    }

    return res.json({ tasks });
  } catch (error) {
    console.error("Planner tasks error:", error.message);
    return res.status(500).json({
      error: "Failed to load planner tasks",
    });
  }
}

// Update task completion
async function updatePlannerTask(req, res) {
  try {
    const { taskId } = req.params;
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      return res.status(400).json({
        error: "Completed must be true or false",
      });
    }

    const task = await PlannerTask.findOneAndUpdate(
      { _id: taskId, userId: req.user.id },
      {
        completed,
        completedAt: completed ? new Date() : null,
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        error: "Planner task not found",
      });
    }

    return res.json({ task });
  } catch (error) {
    console.error("Update planner task error:", error.message);
    return res.status(500).json({
      error: "Failed to update planner task",
    });
  }
}

module.exports = {
  getPlannerTasks,
  updatePlannerTask,
};