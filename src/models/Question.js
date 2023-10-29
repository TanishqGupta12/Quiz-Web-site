// import { model } from "mongoose";
import db from "../db";

const questionSchema = new db.Schema({
   
    question: {
        type: String,
        // required: true,
      },
      options: {
        type: [String],
        // required: true,
      },
      correctAnswer: {
        type: String,
        // required: true,
      },

});

export const model =  db.models.questionquizzes || db.model("questionquizzes", questionSchema);
