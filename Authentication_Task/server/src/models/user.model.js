import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:3
    },

    email:{
        type:String,
        required:true,
        unique:true,
        match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    passwordHash:{
        type: String,
        required: true
    },
    refreshToken:{
        type:String,
        default:null
    }
},
    {
        timestamps:true
    }
)

const userModel = mongoose.model("user",UserSchema)
export default userModel;