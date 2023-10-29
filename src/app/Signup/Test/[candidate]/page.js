"use client";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import "../../Signup.css";
import { useRouter } from "next/navigation";


function Candidatetest({params}) {
  const router = useRouter();

  // console.log(params);
  const [questions, setQuestions] = useState([]); 
  const [userAnswers, setUserAnswers] = useState([]);
  // const [score, setScore] = useState(null);
  const [remainingTime, setRemainingTime] = useState(60);


  const handleget = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/Question");
      const fetchedQuestions = response.data.data; 
      setQuestions(fetchedQuestions); 
    } catch (error) {
      console.error("Error fetching questions:", error.message); 
    }
  };

  useEffect(() => {
    handleget();
  }, []);

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[questionIndex] = selectedOption;
    setUserAnswers(updatedUserAnswers);
  };

  const calculateScore =  async () => {
    let calculatedScore = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        calculatedScore++;
      }
    });
    let attempt  = calculatedScore
    let score  = calculatedScore * 5

    var response
    try {
     response = await axios.put(`http://localhost:3000/api/sign/${params.candidate}` ,{
      attempt,
      score
    });
    // console.log(response.data.Success);
      
    } catch (error) {
      console.error("Error fetching questions:", error.message); // Fix typo: 'massage' to 'message'
    }
    
    if (response.data.Success) {
      router.push(`/Signup/Score/${response.data.data._id}`);

    }

  };

  useEffect(() => {
    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  
  let emails="tanishwq" 
  useEffect(() => {
    if (remainingTime === 0) {
      if (minutes === 0 && seconds === 0) {
        calculateScore();
        setRemainingTime(1 * 60);
      }
    }
  }, [remainingTime]);

  return (
    <>
      <div className="candidate_main">
        <div className="couter">
          <p>
            {minutes} :{seconds}
          </p>
        </div>
        <h1>Quiz App</h1>
  
        {questions.map((question, index) => (
          <div className="candidate_main_1" key={index}>

            <p>{question.question}</p>
            {}
            <div>
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex}>
                  <input
                    type="radio"
                    name={`q${index}`}
                    value={option}
                    checked={userAnswers[index] === option}
                    onChange={() => handleAnswerSelect(index, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button onClick={calculateScore}>Submit</button>
      </div>
    </>
  );
}

export default Candidatetest;


