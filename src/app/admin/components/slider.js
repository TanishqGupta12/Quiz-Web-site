
"use client"
import React from "react";
import Link from "next/link";
import "../controller/layout.css"

export default function Slider() {
  return (
    
      <div className="Slider">
        <div>
          <Link href="/">HOME</Link>
        </div>
        <div>
          <Link href="/admin/controller/Questioncreate">Question Create</Link>
        </div>
        <div>
          <Link href="/admin/controller/Questionlist">Question list</Link>
        </div>
        <div>
          <Link href="/admin/controller/candatelist">Candidate List</Link>
        </div>
        <div>
          <Link href="/admin/controller/createadmin">Create Admin</Link>
        </div>
        <div>
          {/* Add a proper link here */}
        </div>
      </div>
    
  );
}
