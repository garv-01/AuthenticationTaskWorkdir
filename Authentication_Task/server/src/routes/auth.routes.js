import { Router } from "express"
import { registerValidator , validateRequest} from "../validator/register.validator.js";
import { loginController, logoutController, meController, refreshTokenController, registerController } from "../controllers/auth.controller.js";
import { loginValidator } from "../validator/login.validator.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/register",registerValidator , validateRequest, registerController)

router.post("/login",loginValidator,validateRequest,loginController)

router.get("/protected",authMiddleware,(req,res)=>{
    res.status(200).json({
        message:"You are authenticated successfully",
        user:req.user
    })
})
router.post("/refresh-token",refreshTokenController)

router.post("/logout",authMiddleware,logoutController)
router.get("/getMe",authMiddleware,meController)
export default router;