import userModel from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { createAccessToken, createRefreshToken, readRefreshToken } from "../utils/auth.utils.js"
export const registerController = async(req,res)=>{
    try {
        
        const {name , email , password} = req.body
        
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(409).json({
                message:"User already exists"
            })
        }

        //hash the password
        const passwordHash = await bcrypt.hash(password,12)

        //creating new user 
        const newUser = await userModel.create({
            name,
            email,
            passwordHash
        })

        return res.status(201).json({
            message:"User created successfully",
            data:{
                user:{
                    id:newUser._id,
                    name:newUser.name,
                    email:newUser.email,
                }
            }
        })

    } catch (error) {
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const loginController = async(req,res)=>{
    try {
        const {email , password } = req.body
        const getUser = await userModel.findOne({email})
        if(!getUser){
            return res.status(401).json({
                message:"Invalid email or password"
            })
        }


        const isMatchPassword = await bcrypt.compare(password,getUser.passwordHash)
        if(!isMatchPassword){
            return res.status(401).json({
                message:"invalid email or password"
            })
        }

        const payload = { id: getUser._id, email: getUser.email }
        const accessToken = createAccessToken(payload)
        const refreshToken = createRefreshToken(payload)
        getUser.refreshToken = refreshToken
        await getUser.save()

        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge: 7 * 24 * 60 * 60 * 1000  // after 7 days refreshToken removes from the browser
        })

        return res.status(200).json({
            message:"user loggedIn Successfully",
            data:{
                accessToken,
                user:{
                    id:getUser._id,
                    email:getUser.email,
                    name:getUser.name
                }
            }
        })
    } catch (error) {
        return res.status(500).json({
            message:"Unable to log in due to an internal server error",
            error:error      
        })
    }
}

export const refreshTokenController = async (req, res) => {
    try {
        // Step 1: Get refresh token from cookie
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token is required"
            });
        }

        // Step 2: Verify refresh token
        let decoded;

        try {
            decoded = readRefreshToken(refreshToken);
        } catch (error) {
            res.clearCookie("refreshToken");

            return res.status(401).json({
                message: "Invalid or expired refresh token"
            });
        }

        // Step 3: Find user in database
        const user = await userModel.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            res.clearCookie("refreshToken");

            return res.status(401).json({
                message: "Invalid or revoked refresh token"
            });
        }

        // Step 4: Generate new tokens
        const payload = { id: user._id, email: user.email };

        const newAccessToken = createAccessToken(payload);
        const newRefreshToken = createRefreshToken(payload);

        // Step 5: Update refresh token in database
        const updatedUser = await userModel.findOneAndUpdate(
            {
                _id: user._id,
                refreshToken: refreshToken
            },
            {
                $set: {
                    refreshToken: newRefreshToken
                }
            },
            {
                new: true
            }
        );

        if (!updatedUser) {
            return res.status(401).json({
                message: "Refresh token has already been used"
            });
        }

        // Step 6: Set new refresh token cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Step 7: Return new access token
        return res.status(200).json({
            message: "Tokens refreshed successfully",
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error("Refresh token error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const logoutController = async(req,res)=>{
    try {
      const userId = req.user.id
      await userModel.findByIdAndUpdate(userId,{
        $set:{
            refreshToken:null
        }
      });

      res.clearCookie("refreshToken",{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite:"strict",
        path:"/"
      })

      return res.status(200).json({
        message:"User logged out successfully"
      })
    } catch (error) {
        console.error("Logout error",error)

        return res.status(500).json({
            message:"Internal server error"
        })
    }
}
export const meController = async(req,res)=>{
    try {
        const userId = req.user.id

        const user = await userModel
            .findById(userId)
            .select("-passwordHash -refreshToken")

        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        return res.status(200).json({
            message:"User Profile fetched successfully",
            data:{
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email
                }
            }
        })
    } catch (error) {
        console.error("Me controller error",error);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}