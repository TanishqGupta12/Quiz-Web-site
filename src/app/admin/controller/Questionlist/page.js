"use client";

import React, { useState, useEffect } from "react";
import Slider from "../../components/slider";
import "../layout.css";
import Link from "next/link";
import axios from "axios";

export default function Questionlist() {
  const [questions, setQuestions] = useState([]);

  const handleDelete = async (id) => {
    // Implement your delete logic here
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/Question/${id}`
      );
      const questions = response.data.data;
      alert(`Deleting question with ID: ${questions}`);
    } catch (error) {
      console.error("Error fetching questions:", error.massage);
    }

    console.log(`Deleting question with ID: ${id}`);
  };

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/Question");
        const questions = response.data.data;
        setQuestions(questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    getQuestions();
  }, []);

  return (
    <div className="admin_main">
      <Slider />
      <div className="list_container">
        {/* {console.log(questions)} */}
        {questions.map((item) => (
          <div key={item._id}>
            
              <p>{item.question}</p>

            <Link href={`/admin/controller/Questionlist/${item._id}`}>
              Edit
            </Link>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
