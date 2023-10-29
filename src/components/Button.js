"use client"
import React from "react";
import Link from "next/link";
export default function Button() {
  return (
    <>
      <div className="nav">
      <Link href={"/admin"} >ADMIN LOGIN</Link>
      </div>
    </>
  );
}
