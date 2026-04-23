import { model } from "@/models/Question";
import { NextResponse } from "next/server";

export async function GET(_req, { params }) {
  try {
    const { Question } = params;
    const data = await model.findById(Question);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: String(error) }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { Question } = params;
    await model.findByIdAndDelete(Question);
    return NextResponse.json({ data: Question }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: String(error) }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { Question } = params;
    const body = await req.json();
    await model.findByIdAndUpdate(Question, body);
    return NextResponse.json({ Success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: String(error) }, { status: 500 });
  }
}
