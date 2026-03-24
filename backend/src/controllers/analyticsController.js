const { prisma } = require("../prismaClient");

function round1(n) {
  return Math.round(n * 10) / 10;
}

function buildSuggestions({ weakestTopic, weaknessReason, overallAccuracy }) {
  const suggestions = [];

  if (weakestTopic) {
    suggestions.push({
      title: `Focus on ${weakestTopic}`,
      detail: weaknessReason || "This topic shows the weakest performance by accuracy/time.",
    });
  }

  if (overallAccuracy < 0.6) {
    suggestions.push({
      title: "Improve accuracy",
      detail: "Slow down slightly: outline approach, test edge cases, then code.",
    });
  } else if (overallAccuracy < 0.8) {
    suggestions.push({
      title: "Stabilize patterns",
      detail: "Repeat 5–10 problems per weak topic until templates feel automatic.",
    });
  } else {
    suggestions.push({
      title: "Convert accuracy into speed",
      detail: "Add timed sets and harder problems to improve under pressure.",
    });
  }

  suggestions.push({
    title: "Review UNSOLVED attempts",
    detail: "Tag the blocker (idea vs implementation vs edge cases) and reattempt after 24–48h.",
  });

  return suggestions;
}

async function dashboard(req, res) {
  try {
    const userId = req.user.id;
    const total = await prisma.problem.count({ where: { userId } });
    const solved = await prisma.problem.count({ where: { userId, status: "SOLVED" } });

    const byTopicRaw = await prisma.problem.groupBy({
      by: ["topic"],
      where: { userId },
      _count: { _all: true },
    });

    const byTopic = byTopicRaw
      .map((t) => ({ topic: t.topic, count: t._count._all }))
      .sort((a, b) => b.count - a.count);

    return res.json({ totalProblems: total, solvedProblems: solved, byTopic });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ error: "Failed to load dashboard data" });
  }
}

async function analytics(req, res) {
  try {
    const userId = req.user.id;

    const problems = await prisma.problem.findMany({
      where: { userId },
      select: { topic: true, difficulty: true, timeTaken: true, status: true },
    });

    if (problems.length === 0) {
      return res.json({
        weakestTopic: null,
        weakestTopicReason: null,
        overallAccuracy: 0,
        averageTimeByDifficulty: { EASY: null, MEDIUM: null, HARD: null },
        suggestions: buildSuggestions({ weakestTopic: null, weaknessReason: null, overallAccuracy: 0 }),
      });
    }

    const byTopic = new Map();
    let solvedCount = 0;

    for (const p of problems) {
      const entry = byTopic.get(p.topic) || { total: 0, solved: 0, solvedTimeSum: 0, solvedTimeCount: 0 };
      entry.total += 1;
      if (p.status === "SOLVED") {
        entry.solved += 1;
        solvedCount += 1;
        entry.solvedTimeSum += p.timeTaken;
        entry.solvedTimeCount += 1;
      }
      byTopic.set(p.topic, entry);
    }

    const overallAccuracy = problems.length ? solvedCount / problems.length : 0;

    let maxAvgSolvedTime = 0;
    for (const entry of byTopic.values()) {
      const avgSolvedTime = entry.solvedTimeCount ? entry.solvedTimeSum / entry.solvedTimeCount : 0;
      if (avgSolvedTime > maxAvgSolvedTime) maxAvgSolvedTime = avgSolvedTime;
    }
    if (maxAvgSolvedTime === 0) maxAvgSolvedTime = 1;

    let weakestTopic = null;
    let weakestScore = -1;
    let weakestTopicReason = null;

    for (const [topic, entry] of byTopic.entries()) {
      const accuracy = entry.total ? entry.solved / entry.total : 0;
      const avgSolvedTime = entry.solvedTimeCount ? entry.solvedTimeSum / entry.solvedTimeCount : 0;
      const timeFactor = avgSolvedTime / maxAvgSolvedTime;
      const score = (1 - accuracy) * 0.7 + timeFactor * 0.3;

      if (score > weakestScore) {
        weakestScore = score;
        weakestTopic = topic;
        weakestTopicReason =
          `Accuracy ${Math.round(accuracy * 100)}%` +
          (entry.solvedTimeCount ? `, avg solved time ${round1(avgSolvedTime)} min` : ", no solved-time data yet");
      }
    }

    const byDifficulty = new Map([["EASY", []], ["MEDIUM", []], ["HARD", []]]);
    for (const p of problems) {
      if (p.status === "SOLVED") byDifficulty.get(p.difficulty)?.push(p.timeTaken);
    }

    const averageTimeByDifficulty = {};
    for (const [diff, times] of byDifficulty.entries()) {
      averageTimeByDifficulty[diff] = times.length ? round1(times.reduce((a, b) => a + b, 0) / times.length) : null;
    }

    const suggestions = buildSuggestions({
      weakestTopic,
      weaknessReason: weakestTopicReason,
      overallAccuracy,
    });

    return res.json({
      weakestTopic,
      weakestTopicReason,
      overallAccuracy: round1(overallAccuracy),
      averageTimeByDifficulty,
      suggestions,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    return res.status(500).json({ error: "Failed to load analytics" });
  }
}

async function recommendations(req, res) {
  try {
    const userId = req.user.id;

    const problems = await prisma.problem.findMany({
      where: { userId },
      select: { topic: true, status: true },
    });

    if (problems.length === 0) {
      return res.json({
        recommendations: [
          { topic: "Arrays", reason: "Start with fundamentals and patterns." },
          { topic: "Hashing", reason: "Build comfort with lookups and frequency maps." },
          { topic: "Two Pointers", reason: "Common interview pattern across arrays/strings." },
        ],
      });
    }

    const stats = new Map();
    for (const p of problems) {
      const s = stats.get(p.topic) || { total: 0, solved: 0 };
      s.total += 1;
      if (p.status === "SOLVED") s.solved += 1;
      stats.set(p.topic, s);
    }

    const ranked = [...stats.entries()]
      .map(([topic, s]) => ({ topic, accuracy: s.total ? s.solved / s.total : 0, attempts: s.total }))
      .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts);

    const top = ranked.slice(0, 3).map((r) => ({
      topic: r.topic,
      reason: `Lowest accuracy (${Math.round(r.accuracy * 100)}%) across ${r.attempts} attempt(s).`,
    }));

    return res.json({ recommendations: top });
  } catch (err) {
    console.error("Recommendations error:", err);
    return res.status(500).json({ error: "Failed to load recommendations" });
  }
}

module.exports = { dashboard, analytics, recommendations };