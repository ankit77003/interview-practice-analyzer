const { z } = require("zod");
const { prisma } = require("../prismaClient");

const createProblemSchema = z.object({
  title: z.string().min(1).max(200),
  platform: z.string().min(1).max(50),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  topic: z.string().min(1).max(50),
  time_taken: z.number().int().nonnegative().max(24 * 60 * 10),
  status: z.enum(["SOLVED", "UNSOLVED"]),
});

async function createProblem(req, res) {
  try {
    console.log("📝 Request body:", req.body);
    console.log("👤 User:", req.user);

    // 🔥 Ensure user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // 🔥 Convert time_taken safely
    const parsed = createProblemSchema.safeParse({
      ...req.body,
      time_taken: Number(req.body.time_taken),
    });

    if (!parsed.success) {
      console.log("❌ Validation error:", parsed.error.flatten());
      return res.status(400).json({
        error: "Invalid input",
        details: parsed.error.flatten(),
      });
    }

    const p = parsed.data;

    const created = await prisma.problem.create({
      data: {
        userId: req.user.id,
        title: p.title,
        platform: p.platform,
        difficulty: p.difficulty,
        topic: p.topic,
        timeTaken: p.time_taken,
        status: p.status,
      },
    });

    return res.status(201).json({ problem: created });

  } catch (err) {
    console.error("🔥 Create problem error FULL:", err);

    if (err.code === "P2002") {
      return res.status(409).json({ error: "Problem already exists" });
    }

    return res.status(500).json({
      error: "Failed to create problem",
      debug: err.message, // 👈 helps debugging
    });
  }
}

async function listProblems(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const problems = await prisma.problem.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ problems });

  } catch (err) {
    console.error("List problems error:", err);
    return res.status(500).json({ error: "Failed to fetch problems" });
  }
}

module.exports = { createProblem, listProblems };