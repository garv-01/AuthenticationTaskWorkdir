import { validationResult , body } from "express-validator";

export const loginValidator = [
    body("email")
    .exists().withMessage("email is required").bail()
    .trim().toLowerCase().normalizeEmail(),


    body("password")
    .exists().withMessage("password is required").bail()
    .trim().notEmpty()
] 

export const validateRequest = (req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(500).json({
            message:"Login validation failed",
            errors:errors.array()
        })
    }
    next()
}