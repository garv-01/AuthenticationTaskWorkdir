import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
    createProductController,
    deleteProductController,
    getAllProductController,
    getProductByIdController,
    updateProductController
} from "../controllers/product.controller.js";
import { createProductValidator, productIdValidator, updateProductValidator, validateRequest } from "../validator/product.validator.js";



const router = express.Router()

//create product
router.post("/createProduct",authMiddleware,createProductValidator,validateRequest,createProductController)
router.get("/getAllProduct",authMiddleware,getAllProductController)
router.get("/getProduct/:id",authMiddleware,productIdValidator,validateRequest,getProductByIdController)
router.post("/updateProduct/:id",authMiddleware,productIdValidator,updateProductValidator,validateRequest,updateProductController)
router.post("/deleteProduct/:id",authMiddleware,productIdValidator,validateRequest,deleteProductController)


export default router;