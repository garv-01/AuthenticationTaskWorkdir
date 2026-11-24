import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Product name is required"],
        trim:true,
        minLength:[3,"Atleast 3 char is required"],
        maxLength:[100,"product name cannot exceed 100 char"]
    },
    description:{
        type:String,
        required:[true,"description is required"],
        trim:true,
        maxLength:[1000,"description should not exceed 1000 characters"]
    },
    price:{
        type:Number,
        required:[true,"price is required"],
        min:[0,"Price cannot be less than 0"]
    },
    stock:{
        type:Number,
        required:[true,"Stock is required"],
        min:[0,"Stock cannot be less than 0"],
        validate:{
            validator:Number.isInteger,
            message:"Stock must be a whole Number"
        }
    },
    category:{
        type:String,
        required:[true," category is required"],
        trim:true
    },
    image:{
        type:String,
        default:""
    }
},
{
    timestamps:true
}
)

const productModel = mongoose.model("Product",productSchema);
export default productModel;