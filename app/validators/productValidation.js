import Product from "../models/productModel.js";

export const productValidationSchema = {
    name:{
        in:['body'],
        exists:{errorMessage:'name field is required'},
        notEmpty:{errorMessage:'name field is not empty'},
        isLength:{
            Options:{min:3},
            errorMessage:'length should greater than 2'
        },
        trim:true,
        custom:{ 
            options:async function(value){
                try{
                const product=await Product.findOne({name:value})
                if(product){
                    throw new Error('name is already exists try with new one')
                }
                }catch(err){
                    throw new Error(err.message)
                }
                return true
                
            }
        }
    },
   price :{
        in:['body'],
        exists:{errorMessage:'price field is required'},
        notEmpty:{errorMessage:'price field should not be  empty'},
        isLength:{min:1},
        trim:true
    },

}

