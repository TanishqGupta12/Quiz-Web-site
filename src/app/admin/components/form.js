'use client'
import React from "react";

import { useRouter } from "next/navigation";

export default function From() {

    const router = useRouter()

    const Navigation = ()=>{
        alert("Welcome Admin Dashbroad")
        router.push("/admin/controller/Questioncreate")
    }

    return (
        <>

            {/* <div>
                <input type="text" placeholder="Enter Your Username"></input>
            </div> */}
            <div>
                <input type="text" placeholder="Enter Your Unique ID"></input>
            </div>
            <div>
                <input type="email" placeholder="Enter Your Email ID " ></input>
            </div>
            <div>
                <input type="password" placeholder="Enter Your Password" ></input>
            </div>
            <div>
                <button  onClick={()=>{Navigation()}} >Login</button>
            </div>
        </>
    );
}
