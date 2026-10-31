
const OpenAI = require("openai");

const openai =
  process.env.OPENAI_ENABLED === "true" &&
  process.env.OPENAI_API_KEY
    ? new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        maxRetries: 0,
        timeout: 15000,
      })
    : null;

function buildFallbackStrategy(analyticsData) {
  const weakestTopic = analyticsData.weakestTopic || "DSA fundamentals";

  const topic = (analyticsData.topicInsights || []).find(
    (item) => item.topic === weakestTopic
  );

  const accuracy = topic?.accuracy ?? 0;
  const attempts = topic?.attempts ?? 0;

  const practiceSequence = {
    Tree: [
      "Review preorder, inorder and postorder traversals.",
      "Practise tree height, maximum depth and level order.",
      "Move to diameter and balanced binary tree problems.",
      "Then practise LCA and path-sum problems.",
    ],
    Arrays: [
      "Review array traversal and basic operations.",
      "Practise frequency maps and prefix sums.",
      "Move to two pointers and sliding window problems.",
      "Then practise medium-level array problems.",
    ],
    Graph: [
      "Review graph representation and traversal.",
      "Practise BFS and DFS.",
      "Move to cycle detection and connected components.",
      "Then practise shortest-path problems.",
    ],
  };

  return {
    topic: weakestTopic,
    diagnosis:
      `${weakestTopic} has ${accuracy}% accuracy across ` +
      `${attempts} recorded attempts. ` +
      (topic?.needsMoreData
        ? "Collect more attempts before drawing a strong conclusion."
        : "Prioritize reviewing unsolved attempts and strengthening fundamentals."),
    practiceSequence:
      practiceSequence[weakestTopic] || [
        `Review the fundamentals of ${weakestTopic}.`,
        `Practise easy problems in ${weakestTopic}.`,
        `Review mistakes and progress to medium problems.`,
      ],
    weeklyPlan: [
      {
        day: "Days 1–2",
        task: "Revise fundamentals and solve 2 easy problems.",
      },
      {
        day: "Days 3–4",
        task: "Practise 2 problems and review mistakes.",
      },
      {
        day: "Days 5–6",
        task: "Attempt 2 problems without looking at solutions first.",
      },
      {
        day: "Day 7",
        task: "Reattempt an unsolved problem and review progress.",
      },
    ],
    revisionPlan:
      "Revisit mistakes after 24–48 hours and record each new attempt.",
    source: "rule-based",
  };
}

async function generateStrategy(analyticsData) {
  const fallback = buildFallbackStrategy(analyticsData);

  // No API call is made while OpenAI is disabled.
  if (!openai) {
    return fallback;
  }

  try {
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
      instructions: [
        "You are a DSA interview preparation coach.",
        "Use only the supplied analytics as evidence.",
        "Do not invent performance metrics.",
        "Give practical, beginner-friendly recommendations.",
        "Return valid JSON only, with these fields:",
        "topic, diagnosis, practiceSequence, weeklyPlan, revisionPlan.",
        "practiceSequence must be an array of strings.",
        "weeklyPlan must be an array of objects with day and task.",
        "revisionPlan must be a string.",
      ].join(" "),
      input: JSON.stringify(analyticsData),
      max_output_tokens: 600,
    });

    const result = JSON.parse(response.output_text);

    if (
      !result.topic ||
      typeof result.diagnosis !== "string" ||
      !Array.isArray(result.practiceSequence) ||
      !Array.isArray(result.weeklyPlan) ||
      typeof result.revisionPlan !== "string"
    ) {
      throw new Error("Invalid strategy response format");
    }

    return {
      ...result,
      source: "openai",
    };
  } catch (error) {
    console.error(
      "Strategy generation failed:",
      error.status || error.message
    );

    return fallback;
  }
}

module.exports = { generateStrategy };
