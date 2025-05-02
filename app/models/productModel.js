import { Schema,model } from "mongoose";


const productSchema = new Schema({
    name:String,
    price:Number,
    description:String,
    images:String,
    seller: { 
        type: Schema.Types.ObjectId,  
        ref: "Seller"
    },
    category: { 
        type: Schema.Types.ObjectId, 
        ref: "Category" 
    },
    

    isApproved:{type:Boolean,default:false},
    enquiries:[{buyer:Schema.Types.ObjectId,message:String,response:String}],
    views:{type:Number,default:0},
    interestedBuyers:[]

},{timestamps:true})
const Product = model("Product",productSchema)
export default Product;



