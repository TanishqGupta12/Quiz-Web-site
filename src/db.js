/**
 * This file must use Mongoose only — models depend on `module.exports = db`.
 * Do not paste Atlas "MongoClient" sample code here. Put your Atlas URI in `.env` as `MONGODB_URI` (never commit passwords).
 */
const db = require("mongoose");

/** Atlas: `MONGODB_URI` in `.env` — include database name before `?`, e.g. `...net/Quiz?retryWrites=true&w=majority` */
const uri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quiz";

if (!process.env.MONGODB_URI) {
  console.warn(
    "[db] MONGODB_URI unset — using local mongodb://127.0.0.1:27017/quiz. For Atlas, set MONGODB_URI in .env."
  );
}

db.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

module.exports = db;