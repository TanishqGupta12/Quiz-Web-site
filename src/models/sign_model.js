import db from "../db";

const sign_model = new db.Schema({
    Name : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    unique : {
        type : String,
        default : "candidate"
    },
    attempt : {
        type : String,
        default: "00"
    },
    score: {
        type : String,
        default: "00"

    },

})

export const sign_models = db.models.sign || db.model("sign",sign_model )