"use client"
import Link from "next/link";
import React from "react";

import "../Signup.css"
export default function Slider() {
  return (
    <>
      <div className="slider_candidate">
        <div>
          <Link href='/Signup/candidate_test'>Quiz Test</Link>
        </div>
        <div>
          <Link href='/Signup/candidate_scorse'>Score</Link>
        </div>
        <div>
          <button></button>
        </div>
      </div>
    </>
  );
}
