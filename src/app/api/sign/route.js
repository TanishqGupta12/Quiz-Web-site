import { NextResponse } from "next/server";
import { sign_models } from "../../../models/sign_model";

export async function POST(req, res) {
  try {
    var body = await req.json();

    var { Name, email, password } = body;
    var emailexit = await sign_models.findOne({email} );
    // console.log(" email exit" +emailexit);
    if (emailexit) {
      return NextResponse.json({ data: emailexit, Success: true }, { status: 200 });
    }
    // console.log(body);
    let data = await sign_models.create(body);
    // console.log(data)
    return NextResponse.json({ data: data, Success: true }, { status: 200 });
   
    
  } catch (error) {
    return NextResponse.json({ data: error.massage, Success: false }, { status: 500 });
  }
}

export async function GET(req, res) {
  try {
    const data = await sign_models.find();
    return NextResponse.json({ data, Success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error.massage, Success: false }, { status: 500 });
  }
}
