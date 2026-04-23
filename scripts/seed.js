/**
 * Seed MongoDB (Atlas cloud or local). Loads `.env` via dotenv.
 *
 * Collections (database from MONGODB_URI, e.g. Quiz):
 *   questions — sample quiz rows (always, unless already present; use seed:reset to replace)
 *   admins    — SEED_ADMIN_* (role admin default) + optional SEED_SUPERADMIN_* (role superadmin in MongoDB)
 *   signs     — only if SEED_DEMO_EMAIL + SEED_DEMO_PASSWORD (plain password; home / quiz login)
 *
 * Usage:
 *   npm run seed              — questions + optional admin + optional demo candidate
 *   npm run seed:reset        — clears questions, then inserts samples (does not remove admins/signs)
 *
 * Env (optional):
 *   SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD (8+ chars), SEED_ADMIN_NAME, SEED_ADMIN_ROLE (admin|superadmin)
 *   SEED_SUPERADMIN_EMAIL, SEED_SUPERADMIN_PASSWORD (8+ chars), SEED_SUPERADMIN_NAME — second admin row with role superadmin
 *   SEED_DEMO_EMAIL, SEED_DEMO_PASSWORD, SEED_DEMO_NAME — demo quiz user for `/` login
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quiz";
const reset = process.argv.includes("--reset");

function atlasUriMissingDbName(u) {
  if (!u.includes(".mongodb.net")) return false;
  const m = u.match(/\.mongodb\.net\/([^/?]*)/);
  if (!m) return true;
  return !m[1] || !m[1].trim();
}
if (atlasUriMissingDbName(uri)) {
  console.warn(
    "Warning: Atlas URI should include the database name before `?`, e.g. ...mongodb.net/Quiz?retryWrites=true&w=majority"
  );
}
if (!process.env.MONGODB_URI) {
  console.warn("[seed] MONGODB_URI unset — using local fallback. Set MONGODB_URI in .env for Atlas.");
}

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
});

/** Same collection as app: `Quiz.questions` on Atlas */
const Question =
  mongoose.models.Question || mongoose.model("Question", questionSchema, "questions");

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "" },
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
  },
  { timestamps: true }
);

const Admin =
  mongoose.models.Admin || mongoose.model("Admin", adminSchema, "admins");

const signSchema = new mongoose.Schema(
  {
    Name: String,
    email: String,
    password: String,
    unique: { type: String, default: "candidate" },
    attempt: { type: String, default: "00" },
    score: { type: String, default: "00" },
  },
  { timestamps: false }
);

/** Same as app: candidates live in `signs` */
const Sign = mongoose.models.sign || mongoose.model("sign", signSchema);

const SAMPLE_QUESTIONS = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    question: "What does HTTP stand for?",
    options: [
      "HyperText Transfer Protocol",
      "High Transfer Text Process",
      "Hyperlink Transmission Protocol",
      "Host Text Transfer Protocol",
    ],
    correctAnswer: "HyperText Transfer Protocol",
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "JavaScript", "Python"],
    correctAnswer: "JavaScript",
  },
];

async function seedQuestions() {
  if (reset) {
    const r = await Question.deleteMany({});
    console.log(`Removed ${r.deletedCount} question(s).`);
  } else {
    const n = await Question.countDocuments();
    if (n > 0) {
      console.log(`Skipping questions (${n} already in DB). Run: npm run seed:reset`);
      return;
    }
  }
  await Question.insertMany(SAMPLE_QUESTIONS);
  console.log(`Inserted ${SAMPLE_QUESTIONS.length} sample questions.`);
}

async function seedAdmin() {
  const email = (process.env.SEED_ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "";
  if (!email || !password) {
    console.log("Skipping admin seed (set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env).");
    return;
  }
  if (password.length < 8) {
    console.warn("SEED_ADMIN_PASSWORD must be at least 8 characters. Skipping admin seed.");
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const name = (process.env.SEED_ADMIN_NAME || "Seed Admin").trim();
  const rawRole = String(process.env.SEED_ADMIN_ROLE || "admin").toLowerCase();
  const role = rawRole === "superadmin" ? "superadmin" : "admin";
  await Admin.findOneAndUpdate(
    { email },
    { $set: { email, passwordHash, name, role } },
    { upsert: true, new: true }
  );
  console.log(`Upserted admin: ${email} (role: ${role})`);
}

/** Second `admins` document with `role: superadmin` (signs in at /admin like other admins). */
async function seedDbSuperadmin() {
  const email = (process.env.SEED_SUPERADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.SEED_SUPERADMIN_PASSWORD || "";
  if (!email || !password) {
    console.log("Skipping DB superadmin (set SEED_SUPERADMIN_EMAIL + SEED_SUPERADMIN_PASSWORD in .env).");
    return;
  }
  if (password.length < 8) {
    console.warn("SEED_SUPERADMIN_PASSWORD must be at least 8 characters. Skipping.");
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const name = (process.env.SEED_SUPERADMIN_NAME || "Superadmin (DB)").trim();
  await Admin.findOneAndUpdate(
    { email },
    { $set: { email, passwordHash, name, role: "superadmin" } },
    { upsert: true, new: true }
  );
  console.log(`Upserted DB superadmin: ${email} (role: superadmin) — sign in at /admin`);
}

/** Legacy rows without `role` — default to organizer `admin`. */
async function backfillAdminRoles() {
  const r = await Admin.updateMany(
    { $or: [{ role: { $exists: false } }, { role: null }, { role: "" }] },
    { $set: { role: "admin" } }
  );
  if (r.modifiedCount > 0) {
    console.log(`Backfilled role 'admin' on ${r.modifiedCount} admin document(s) missing role.`);
  }
}

async function seedDemoCandidate() {
  const email = (process.env.SEED_DEMO_EMAIL || "").trim().toLowerCase();
  const password = process.env.SEED_DEMO_PASSWORD || "";
  const name = (process.env.SEED_DEMO_NAME || "Demo User").trim();
  if (!email || !password) {
    console.log("Skipping demo candidate (set SEED_DEMO_EMAIL and SEED_DEMO_PASSWORD in .env).");
    return;
  }
  await Sign.findOneAndUpdate(
    { email },
    {
      $set: {
        Name: name,
        email,
        password,
        unique: "candidate",
        attempt: "00",
        score: "00",
      },
    },
    { upsert: true, new: true }
  );
  console.log(`Upserted demo candidate (signs): ${email} — use / home login with this email + password`);
}

async function main() {
  await mongoose.connect(uri);
  console.log("Connected:", uri.replace(/:[^:@]+@/, ":****@"));

  await seedQuestions();
  await seedAdmin();
  await seedDbSuperadmin();
  await backfillAdminRoles();
  await seedDemoCandidate();

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
