"use client";
import React, { useState } from "react";

import Slider from "../../components/slider";
import "../layout.css";

export default function Create() {
  const [question, setquestionn] = useState("");
  const [option_1, setOption_1] = useState("");
  const [option_2, setOption_2] = useState("");
  const [option_3, setOption_3] = useState("");
  const [option_4, setOption_4] = useState("");
  const [correctAnswer, setcorrectAnswer] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const options = []
      options[0] = option_1
      options[1] = option_2
      options[2] = option_3,
      options[3] = option_4
      let result = await fetch("http://localhost:3000/api/Question", {
        method: "POST",
        body: JSON.stringify(
          {question,
          options,
          correctAnswer}
        ),
      });

      console.log(result);
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="admin_main">
        <Slider />
        <div className="create_container">
          <form onSubmit={handleSubmit}>
            <div>
              <textarea
                rows="15"
                cols="120"
                value={question}
                onChange={(e) => setquestionn(e.target.value)}
              />
            </div>
            <div>
              <input
                value={option_1}
                onChange={(e) => setOption_1(e.target.value)}
              />
            </div>
            <div>
              <input
                value={option_2}
                onChange={(e) => setOption_2(e.target.value)}
              />
            </div>
            <div>
              <input
                value={option_3}
                onChange={(e) => setOption_3(e.target.value)}
              />
            </div>
            <div>
              <input
                value={option_4}
                onChange={(e) => setOption_4(e.target.value)}
              />
            </div>
            <div>
              <label>Answer</label>
              <input
                value={correctAnswer}
                onChange={(e) => setcorrectAnswer(e.target.value)}
              />
            </div>
            <button type="submit">POST</button>
          </form>
        </div>
      </div>
    </>
  );
}
