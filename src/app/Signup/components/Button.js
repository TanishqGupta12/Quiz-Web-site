"use client";
import axios from "axios";
import React, { useState } from "react";

import { useRouter } from "next/navigation";

export default function Button() {
    const router = useRouter()

  const [Name, setName] = useState();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();


  const onSubmit = async (e) => {
    e.preventDefault();

    const data = await axios.post("http://localhost:3000/api/sign", {
        Name,
        email,
        password,
    });
    console.log(data);
    if (data.data.Success) {
      alert(`welcome to ${Name}`)
      alert(`Are You Ready Quiz Test \n \n Complete Time 2 min`)
      router.push(`/Signup/Test/${data.data.data._id}`)
      
    }
};


  return (
    <>
      {/* {console.log(Name, email, password)} */}
        <div>
          <input
            type="text"
            value={Name}
            name="user"
            placeholder="Enter Your Username"
            onChange={(e)=>{setName(e.target.value)}}
          ></input>
        </div>
        <div>
          <input
            type="email"
            value={email}
            name='email'
            placeholder="Enter Your Email ID "
            onChange={(e)=>{setemail(e.target.value)}}
          ></input>
        </div>
        <div>
          <input
            type="password"
            value={password}
            name='password'
            placeholder="Enter Your Password"
            onChange={(e)=>{setpassword(e.target.value)}}
          ></input>
        </div>
        <div>
          <button onClick={onSubmit}>Sign up</button>
        </div>
    </>
  );
}
