import { model } from "@/models/Question";
import { NextResponse } from "next/server";

export async function GET(req , res) {
    try {
    const { Question } = res.params;

      const data = await model.findById( Question );
      return NextResponse.json({ data: data }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ data: error }, { status: 500 });
    }
  }

export async function DELETE(req, res) {
  try {
    const { Question } = res.params;
    const data = await model.findByIdAndDelete(Question);

    return NextResponse.json({ data: Question }, { status: 200 });
  } catch (error) {}
  return NextResponse.json({ data: error.massage }, { status: 500 });
}


export async function PUT(req , res) {
   try {
    const { Question } = res.params;
    const body = await req.json();
    console.log(body);
    await model.findByIdAndUpdate(Question ,body)
    return NextResponse.json({ Success : true }, { status: 200 });
   } catch (error) {
    return NextResponse.json({ data: error }, { status: 500 });
    
   }

}
