import dotenv from "dotenv"
dotenv.config()

const config = {
    port : process.env.port,
    mongo_URI : process.env.mongo_URI,
    accessToken : process.env.accessToken,
    refreshToken : process.env.refreshToken
}

export default config;