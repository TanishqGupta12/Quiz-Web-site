"use client";
import React, { useEffect , useState}  from "react";

import "../../Signup.css";

import Box from "@mui/joy/Box";
import CircularProgress from "@mui/joy/CircularProgress";
import axios from "axios";

export default function CircularProgressDeterminate({params}) {
  // console.log(params.candidate);
  const [first, setfirst] = useState({})
  const handleget = async ()=>{
    try {
      const data = await axios.get(`http://localhost:3000/api/sign/${params.candidate}`);

      console.log(data.data.data);
      setfirst(data.data.data)
    } catch (error) {
      console.log(error.massage);
    }
  }
  
  useEffect(()=>{
    handleget()

  },[])
  
  return (
   <>

    <Box
      sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
    >
      
      <CircularProgress
        
        determinate
        value={parseInt(first.score)}
        color="primary"
        className="CircularProgress"
        sx={{
          "--CircularProgress-size": "250px",
          "--CircularProgress-trackThickness": "30px",
          "--CircularProgress-progressThickness": "30px",
        }}
      >
      Score : {parseInt(first.score)}
      </CircularProgress>
      <CircularProgress
        determinate
        value={parseInt(first.attempt)}
        color="success"
        className="CircularProgress_2"
        sx={{
          "--CircularProgress-size": "250px",
          "--CircularProgress-trackThickness": "30px",
          "--CircularProgress-progressThickness": "30px",
        }}
      >
      Attempt: {parseInt(first.attempt)}
      </CircularProgress>
    </Box>
   </>
   
  );
}
