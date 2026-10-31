
const Problem = require("../models/Problem");
const {
  generateStrategy,
} = require("../services/aiStrategyService");

async function getStrategy(req, res) {
  try {
    const userId = req.user.id;

    const problems = await Problem.find({ userId })
      .select("topic difficulty timeTaken status")
      .lean();

    const topicStats = new Map();

    for (const problem of problems) {
      const stats = topicStats.get(problem.topic) || {
        attempts: 0,
        solved: 0,
        solvedTimeSum: 0,
        solvedTimeCount: 0,
      };

      stats.attempts += 1;

      if (problem.status === "SOLVED") {
        stats.solved += 1;
        stats.solvedTimeSum += problem.timeTaken;
        stats.solvedTimeCount += 1;
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
          averageTime:
            averageTime === null
              ? null
              : Math.round(averageTime * 10) / 10,
          needsMoreData: stats.attempts < 3,
        };
      }
    );

    const averageTimes = topicInsights
      .filter((topic) => topic.averageTime !== null)
      .map((topic) => topic.averageTime);

    const maxAverageTime = Math.max(1, ...averageTimes);

    for (const topic of topicInsights) {
      const accuracy = topic.accuracy / 100;

      const timeFactor =
        topic.averageTime === null
          ? 0
          : Math.min(topic.averageTime / maxAverageTime, 1);

      topic.weaknessScore = Math.round(
        ((1 - accuracy) * 0.7 + timeFactor * 0.3) * 1000
      ) / 10;
    }

    topicInsights.sort(
      (a, b) => b.weaknessScore - a.weaknessScore
    );

    const weakestTopic = topicInsights[0]?.topic ?? null;

    const analyticsData = {
      weakestTopic,
      topicInsights,
      totalProblems: problems.length,
      solvedProblems: problems.filter(
        (problem) => problem.status === "SOLVED"
      ).length,
    };

    const strategy = await generateStrategy(analyticsData);

    return res.json({ strategy });
  } catch (error) {
    console.error("Strategy controller error:", error.message);

    return res.status(500).json({
      error: "Failed to generate a preparation strategy",
    });
  }
}

module.exports = { getStrategy };
