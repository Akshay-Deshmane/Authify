import userModel  from "../models/user.model.js";
import crypto from "crypto"
import jwt from "jsonwebtoken";
import config from "../config/config.js"
import sessionModel from "../models/session.model.js";



export async function register(req, res) {

    const {username, email, password} = req.body;

    const isAlreadyRegistered = await userModel.findOne({
        $or : [
            {username},
            {email}
        ]
    })

    if(isAlreadyRegistered) {
        return res.status(409).json({
            message : "Username or Email is already exists"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const user = await userModel.create({
        username, 
        email,
        password : hashedPassword
    })
    

    const refreshToken = jwt.sign({
        id : user._id
    }, config.JWT_SECRET,
    {
        expiresIn : "7d"
    }
    )
    
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.create({
        user : user._id,
        refreshTokenHash,
        ip : req.ip,
        userAgent : req.headers["user-agent"]
    })

    const accessToken = jwt.sign({
        id : user._id,
        sessionId : session._id
    }, config.JWT_SECRET,
    {
        expiresIn : "15m"
    }
    )


    res.cookie("refreshToken", refreshToken, {
        httpOnly : true,
        secure : true,
        sameSite : "strict",
        maxAge : 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
        message : "User registered successfully",
        user : {
            id : user._id,
            email : user.email
        },
        accessToken
    })

}


export async function login(req, res) {
   
    const {email, password} = req.body;

    const user = await userModel.findOne({email});

    if(!user) {
        return res.status(401).json({
            message : "Invalid email or password"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const isPasswordValid = hashedPassword === user.password;

    if(!isPasswordValid) {
        return res.status(401).json({
            message : "Invalid email or password"
        })
    }

    const refreshToken = jwt.sign({
        id : user._id
    }, config.JWT_SECRET, {
        expiresIn : "7d"
    })

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex"); 

    const session = await sessionModel.create({
        user : user._id,
        refreshTokenHash,
        ip : req.ip,
        userAgent : req.headers["user-agent"]
    })

    const accessToken = jwt.sign({
        id : user._id,
        sessionId : session._id,
    }, config.JWT_SECRET,{
        expiresIn : "15m"
    })
    
    // store the refreshtoken in the cookie 
    res.cookie("refreshToken", refreshToken, {
        httpOnly : true,
        secure : true,
        sameSite : "strict",
        maxAge : 7 * 24 * 60 * 60 // 7 days
    })


    return res.status(201).json({
        message : "User logged in successfully",
        user : {
            uesrname : user.username,
            email : user.email
        },
        accessToken
    })
}


export async function getMe(req, res) {

 const token = req.headers.authorization?.split(" ")[1];

 if(!token){
    return res.status(401).json({
        message : "Token not found"
    })
 }
  
 const decoded = jwt.verify(token, config.JWT_SECRET)

 const user = await userModel.findById(decoded.id)

 return res.status(200).json({
    message : "User fetched successfully",
    user : {
        username : user.username,
        email : user.email
    }
 })



}   


export async function refreshToken(req, res) {
  
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        return res.status(401).json({
            message : "Refresh token not found, You are not allowed to access this page"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
 
    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked : false
    })
    
    if(!session) {
        return res.status(401).json({
            message : "Invalid Refresh Token"
        })
    }

    const accessToken = jwt.sign({
        id : decoded.id
    }, config.JWT_SECRET, 
    {
        expiresIn : "15m"
    })
    

    const newRefreshToken = jwt.sign({
        id : decoded.id
    }, config.JWT_SECRET, 
    {
        expiresIn : "7d"
    })
    
    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly : true,
        secure : true,
        sameSite : "strict",
        maxAge : 7 * 24 * 60 * 60 * 1000
    })


    return res.status(200).json({
        message : "Access Token refreshed successfully",
        accessToken
    })

}


export async function logOut(req, res) {

    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        return res.status(400).json({
            message : "Refresh token not found"
        })
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked : false
    })

    if(!session) {
        return res.status(400).json({
            message : "Invalid Refresh Token"
        })
    }


    session.revoked = true;
    await session.save();


    res.clearCookie("refreshToken");

    return res.status(200).json({
        message : "user logged out successfully"
    })
}


export async function  logoutAll(req, res) {
    
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        return res.status(400).json({
            message : "Refresh Token Not Found"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    await sessionModel.updateMany({
        user : decoded.id,
        revoked : false
    },
    {
        revoked : true
    })

    
    res.clearCookie("refreshToken");


    return res.status(200).json({
        message : "Logged out form all devices successfully"
    })







}




