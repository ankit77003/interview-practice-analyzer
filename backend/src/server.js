require("dotenv").config();

const { app } = require("./app");
const connectDB = require("./config/db");
const passport = require("passport");

require("./config/passport");

const port = Number(process.env.PORT || 4000);

if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI in environment.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET in environment.");
  process.exit(1);
}

app.use(passport.initialize());

async function main() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
}

main();