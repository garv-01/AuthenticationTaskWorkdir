import productModel from "../models/products.models.js";


//create a product
export const createProductController= async (req,res)=>{
    try {
        const {name,description,price,stock,category,image} = req.body

        const product = await productModel.create({
            name,
            description,
            price,
            image,
            category,
            stock,
        })

        return res.status(201).json({
            success:true,
            message:"product created successfully",
            productData:product
        })
    } catch (error) {
        console.error("Unable to create product",error.message);
        
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const getAllProductController = async(_req,res)=>{

    try {
        
        const getProduct = await productModel.find()
        return res.status(200).json({
            message:"Products fetched successfully",
            productData:getProduct
        })

    } catch (error) {
        console.error("Unable to fetch the products",error.message);
        
        return res.status(500).json({
            message:"Internal server Error"
        })
    }
}

export const getProductByIdController = async(req,res)=>{

    try {
        const { id } = req.params;
        const product = await productModel.findById(id)

        if(!product){
            return res.status(404).json({
                success:false,
                message:"Unable to find the product"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Product fetched successfully",
            data:product
        })

    } catch (error) {
        console.error("Unable to fetch the product by Id",error.message)

        return res.status(500).json({
            success:false,
            message:"Internal server Error"
        })
    }
}

export const updateProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Unable to find the product"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            productData: updatedProduct
        });

    } catch (error) {
        console.error("Unable to update the product", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
export const deleteProductController = async(req,res)=>{

    try {
        const { id } = req.params

        const deleteProduct = await productModel.findByIdAndDelete(id)

        if(!deleteProduct){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Product deleted successfully",
            data:deleteProduct
        })
    } catch (error) {
        console.error("Delete product error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}