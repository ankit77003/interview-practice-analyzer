require("dotenv").config();

const { app } = require("./app");
const { prisma } = require("./prismaClient");

const port = Number(process.env.PORT || 4000);

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL in environment.");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET in environment.");
  process.exit(1);
}

async function main() {
  try {
    await prisma.$connect();
  } catch (err) {
    console.error("Failed to connect to Postgres. Check DATABASE_URL and that Postgres is running.");
    console.error(err?.message || err);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

main();

