import db from "../db";

const adminSchema = new db.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "" },
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

/** Collection name `admins` (same as Atlas / seed script). */
export const AdminModel =
  db.models.Admin || db.model("Admin", adminSchema, "admins");
