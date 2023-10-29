
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import Slider from "../../../components/slider";
import "../../../controller/layout.css";

export default function Questionedit({ params }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/Question/${params.Questionedit}`
        );
        // setapi(response.data.data);
        setQuestion(response.data.data.question);
        setOptions(response.data.data.options);
        setCorrectAnswer(response.data.data.correctAnswer);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    getQuestions();
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedQuestion = {
      question: question,
      option: options,
      correctAnswer: correctAnswer
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/api/Question/${params.Questionedit}`,
        updatedQuestion
      );

      alert("Question updated successfully", response.data.Success);
    } catch (error) {
      console.log(error.message);
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
                name="Question"
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                }}
              ></textarea>
            </div>
            {options.map((option, index) => (
              <div key={index}>
                <input
                  name={`option_${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    var newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                />
              </div>
              ))}
            <div>
              <label>Answer</label>
              <input
                name="Answer"
                value={correctAnswer}
                onChange={(e) => {
                  setCorrectAnswer(e.target.value);
                }}
              />
            </div>
            <button type="submit">UPDATE</button>
          </form>
        </div>
      </div>
    </>
  );
}
