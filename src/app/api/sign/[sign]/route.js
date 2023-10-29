
import {sign_models} from '../../../../models/sign_model'

import { NextResponse } from "next/server";
export async function GET(req , res) {
    try {
    const { sign } = res.params;
        // console.log(sign);
      const data = await sign_models.findById( sign );
      // console.log(data);
      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ data: error }, { status: 500 });
    }
  }
export async function PUT(req , res) {
    try {
    const { sign } = res.params;
        // console.log(sign);
      const body = await req.json()
      // console.log(body);
      const { attempt , score } = body
      const data = await sign_models.findById( sign );
      data.attempt = attempt
      data.score = score
      data.save()
      console.log(data);
      return NextResponse.json({ data ,Success: true   }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ data: error }, { status: 500 });
    }
  }