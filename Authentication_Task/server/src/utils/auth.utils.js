//in this file we are going to create the access and refresh token and verifies them
import jwt from "jsonwebtoken"
import config from "../config/config.js"

//accessToken is created
export const createAccessToken = (payload)=>{
    return jwt.sign(
        payload,
        config.accessToken,
        {expiresIn:"15m"}
    )
}

//refreshToken is created
export const createRefreshToken = (payload)=>{
    return jwt.sign(
        payload,
        config.refreshToken,
        {expiresIn:"7d"}
    )
}

//VERIFICATION
//Verify accesssToken

export const readAccessToken = (token)=>{
    return jwt.verify(token , config.accessToken)
}

//Verify refreshToken

export const readRefreshToken = (token)=>{
    return jwt.verify(token , config.refreshToken)
}