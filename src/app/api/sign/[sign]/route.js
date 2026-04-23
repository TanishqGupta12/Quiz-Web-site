import { sign_models } from "../../../../models/sign_model";
import { NextResponse } from "next/server";

export async function GET(_req, { params }) {
  try {
    const { sign } = params;
    const data = await sign_models.findById(sign);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: String(error) }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { sign } = params;
    const body = await req.json();
    const { attempt, score } = body;
    const data = await sign_models.findById(sign);
    if (!data) {
      return NextResponse.json({ Success: false, message: "Not found" }, { status: 404 });
    }
    data.attempt = String(attempt);
    data.score = String(score);
    await data.save();
    const plain = data.toObject ? data.toObject() : data;
    return NextResponse.json({ data: { ...plain, _id: String(plain._id) }, Success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: String(error), Success: false }, { status: 500 });
  }
}