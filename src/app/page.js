"use client";
import axios from "axios";
import "./page1.css";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Home() {
  const router = useRouter();

  const [currentemail, setemail] = useState(""); // Corrected useState usage
  const [currentpassword, setpassword] = useState(""); // Corrected useState usage

  const submit = async () => {
    const data = await axios.post("http://localhost:3000/api/sign", {
      email : currentemail,
      password : currentpassword,
    });

    console.log(data);
    // console.log(data.data.Success);
    if (data.data.Success) {
      router.push(`/Signup/Test/${data.data.data._id}`);
    }
  };

  return (
    <>
      {/* {console.log({
        currentemail,
        currentpassword,
      })} */}
      <div className="main">
        <div className="nav">
          <Link href={"/admin"}>ADMIN LOGIN</Link>
        </div>
        <div className="main_container">
          <h1>QUIZ APP </h1>
          <div className="login">
            <div>
              <input
                type="email"
                value={currentemail}
                onChange={(e) => {
                  setemail(e.target.value);
                }}
                placeholder="Enter Your Email ID"
              />
            </div>
            <div>
              <input
                type="password"
                value={currentpassword}
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                placeholder="Enter Your Password"
              />
            </div>
            <div>
              <button onClick={submit}>Login</button>
            </div>
            <div>
              <button
                onClick={() => {
                  router.push("Signup");
                }}
              >
                Signup
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
