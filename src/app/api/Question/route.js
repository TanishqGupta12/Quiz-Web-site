import { NextResponse } from "next/server";

import { model } from "../../../models/Question";
export async function GET() {
  try {
    const data = await model.find().lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error.message || error), data: [] }, { status: 500 });
  }
}

export async function POST(req, res) {
  try {
    console.log(req);
    const body = await req.json();
    // console.log(body);
    let Questions = await model.create(body);
    return NextResponse.json({ data: Questions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error }, { status: 500 });
  }
}


 

