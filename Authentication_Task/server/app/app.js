import express from "express";
import authRoutes from "../src/routes/auth.routes.js";
import productRoutes from "../src/routes/product.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors"
const app = express();

console.log("APP.JS LOADED");

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/product",productRoutes)
export default app;