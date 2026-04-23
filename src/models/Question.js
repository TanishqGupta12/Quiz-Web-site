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

/** Atlas collection name `questions` (database e.g. `Quiz` from MONGODB_URI). */
export const model =
  db.models.Question || db.model("Question", questionSchema, "questions");
