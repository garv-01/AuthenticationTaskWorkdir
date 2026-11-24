import mongoose from "mongoose"
import config from "./config.js"

const ConnectDB = async()=>{
    await mongoose.connect(config.mongo_URI)
    console.log("database connected successfully to the app");
    
}

export default ConnectDB;