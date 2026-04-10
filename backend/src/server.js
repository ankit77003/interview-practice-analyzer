require("dotenv").config();

const { app } = require("./app");
const { prisma } = require("./prismaClient");

// 🔥 ADD THIS
const passport = require("passport");
require("./config/passport"); // 👈 make sure this file exists

// ⚠️ Keep port consistent with frontend
const port = Number(process.env.PORT || 5000);

// ==========================
// ✅ ENV CHECKS
// ==========================
if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL in environment.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET in environment.");
  process.exit(1);
}

// ==========================
// 🚀 MAIN FUNCTION
// ==========================
async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Failed to connect to Postgres.");
    console.error(err?.message || err);
    process.exit(1);
  }

  // ==========================
  // 🔥 PASSPORT INIT (VERY IMPORTANT)
  // ==========================
  app.use(passport.initialize());

  // ==========================
  // 🚀 START SERVER
  // ==========================
  const PORT = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🚀 Backend running at http://localhost:${port}`);
  });
}

const cors = require("cors");

app.use(cors({
  origin: "*", // or your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
main();