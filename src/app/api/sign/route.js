import { NextResponse } from "next/server";
import { sign_models } from "../../../models/sign_model";

function signToClient(doc) {
  if (!doc) return null;
  return {
    ...doc,
    _id: String(doc._id),
  };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { Name, email, password } = body;
    const emailNorm = String(email || "").trim().toLowerCase();
    if (!emailNorm || password == null || password === "") {
      return NextResponse.json(
        { Success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const existing = await sign_models
      .findOne({
        email: new RegExp(`^${emailNorm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
      })
      .lean();
    if (existing) {
      if (String(existing.password).trim() !== String(password).trim()) {
        return NextResponse.json(
          { Success: false, error: "Invalid email or password." },
          { status: 401 }
        );
      }
      return NextResponse.json({ data: signToClient(existing), Success: true }, { status: 200 });
    }

    const data = await sign_models.create({
      Name,
      email: emailNorm,
      password,
      unique: body.unique,
    });
    const plain = data.toObject ? data.toObject() : data;
    return NextResponse.json({ data: signToClient(plain), Success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { Success: false, error: String(error.message || error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await sign_models.find().lean();
    return NextResponse.json({ data, Success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ Success: false, error: String(error.message || error) }, { status: 500 });
  }
}
