import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username : {
        type : String,
        required : [true, "user name is required"],
        unique : [true, "user name should be unique"]
    },
    email : {
        type : String,
        required : [true, "email is required"],
        unique : [true, "email should be unique"]
    },
    password : {
        type : String,
        required : [true, "password should be required"]
    }
})


const userModel = mongoose.model("users", userSchema);


export default userModel;