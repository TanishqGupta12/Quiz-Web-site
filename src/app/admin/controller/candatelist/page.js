"use client";

import React, { useState, useEffect } from "react";
import Slider from "../../components/slider";
import axios from "axios";
import "../layout.css";

export default function Candidatelist() {
  const [currentdata, setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const candidatedata = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/sign");
      setdata(response.data.data);
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    candidatedata();
  }, []);

  return (
    <>
      <div className="admin_main">
        <Slider />
        <div className="candidatelist_container">
          <div className="candidatelist_container_grid" >
              <label>Name</label>
              <label>Email</label>
              <label>Score</label>
              <label>Attempt</label>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : currentdata.length === 0 ? (
            <p>No candidates found.</p>
          ) : (
            currentdata.map((item) => (
              <div key={item.id} className="candidatelist_container_grid">
                
                  <p>{item.Name}</p>
                
                  <p>{item.email}</p>
                
                  <p>{item.score}</p>

                  <p>{item.attempt}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
