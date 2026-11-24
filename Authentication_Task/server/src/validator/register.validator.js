import { body, validationResult } from "express-validator";

export const registerValidator = [
    body("name")
        .exists().withMessage("Name is required")
        .bail()
        .isString().withMessage("Name must be a string")
        .bail()
        .trim()
        .notEmpty().withMessage("Name cannot be empty")
        .bail()
        .isLength({ min: 3, max: 20 })
        .withMessage("Name must be between 3 and 20 characters"),

    body("email")
        .exists().withMessage("Email is required")
        .bail()
        .isString().withMessage("Email must be a string")
        .bail()
        .trim()
        .isEmail().withMessage("Enter a valid email address")
        .bail()
        .normalizeEmail(),

    body("password")
        .exists().withMessage("Password is required")
        .bail()
        .isString().withMessage("Password must be a string")
        .bail()
        .notEmpty().withMessage("Password cannot be empty")
        .bail()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
];

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array()
        });
    }

    next();
};