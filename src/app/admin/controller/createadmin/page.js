"use client";
import React from "react";

import "../layout.css";
import Slider from "../../components/slider";
import From from "../../components/form";

export default function CreateAdmin() {
  return (
    <>
      <div className="admin_main">
        <Slider />
        <div className="admin_container">
          {/* <div className="center"> */}
          <h1>Create Admin</h1>
            <div>
              <input type="text" placeholder="Enter Your Username"></input>
            </div>
            <div>
              <input type="text" placeholder="Enter Your Unique ID"></input>
            </div>
            <div>
              <input type="email" placeholder="Enter Your Email ID "></input>
            </div>
            <div>
              <input type="password" placeholder="Enter Your Password"></input>
            </div>
            <div>
              <button onClick={() => {Navigation();}}>Sign up</button>
            </div>
          {/* </div> */}
        </div>
      </div>
    </>
  );
}
