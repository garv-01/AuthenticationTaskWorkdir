
import { body, validationResult, param } from "express-validator";

// CREATE PRODUCT VALIDATOR
export const createProductValidator = [
    body("name")
        .exists()
        .withMessage("Product name is required")
        .bail()
        .isString()
        .withMessage("Product name must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Product name cannot be empty")
        .isLength({ min: 3, max: 100 })
        .withMessage("Product name must be between 3 and 100 characters"),

    body("description")
        .exists()
        .withMessage("Product description is required")
        .bail()
        .isString()
        .withMessage("Description must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty")
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),

    body("price")
        .exists()
        .withMessage("Price is required")
        .bail()
        .isFloat({ min: 0 })
        .withMessage("Price must be a non-negative number")
        .toFloat(),

    body("stock")
        .exists()
        .withMessage("Product stock is required")
        .bail()
        .isInt({ min: 0 })
        .withMessage("Stock must be a whole number greater than or equal to 0")
        .toInt(),

    body("category")
        .exists()
        .withMessage("Product category is required")
        .bail()
        .isString()
        .withMessage("Category must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Category cannot be empty"),

    body("image")
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage("Image must contain a valid URL")
];


// UPDATE PRODUCT VALIDATOR
export const updateProductValidator = [
    body("name")
        .optional()
        .isString()
        .withMessage("Product name must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Product name cannot be empty")
        .isLength({ min: 3, max: 100 })
        .withMessage("Product name must be between 3 and 100 characters"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty")
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),

    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a non-negative number")
        .toFloat(),

    body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be a whole number greater than or equal to 0")
        .toInt(),

    body("category")
        .optional()
        .isString()
        .withMessage("Category must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Category cannot be empty"),

    body("image")
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage("Image must contain a valid URL"),

    // Reject an empty update body
    body().custom((value) => {
        if (
            !value ||
            typeof value !== "object" ||
            Array.isArray(value) ||
            Object.keys(value).length === 0
        ) {
            throw new Error("At least one field is required");
        }

        return true;
    })
];


// PRODUCT ID VALIDATOR
export const productIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid product ID")
];


// VALIDATION ERROR HANDLER
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((error) => ({
                field: error.path,
                message: error.msg
            }))
        });
    }

    next();
};
