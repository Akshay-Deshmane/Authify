import mongoose from "mongoose"



const sessionSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : [true, "user is required"]
    },
    refreshTokenHash : {
        type : String,
        required : [true, "IP address is required"]
    },
    ip : {
        type : String, 
        required : [true, "IP address is required"]
    },
    userAgent : {
        type : String, 
        required : [true, "UserAgent is required"]
    },
    revoked : {
        type : Boolean, 
        default : false
    }
}, {
    timestamps : true
})


const sessionModel = mongoose.model("session", sessionSchema)


export default sessionModel;