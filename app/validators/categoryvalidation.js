import Category from "../models/categoryModel.js"
export const categoryValidationSchema={
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
                const category=await Category.findOne({name:value})
                if(category){
                    throw new Error('name is already exists try with new one')
                }
                }catch(err){
                    throw new Error(err.message)
                }
                return true
                
            }
        }
    }
}

export const idValidationSchema={
    id:{
        in:['params'],
        isMongoId:{errorMessage:'please provide valid mongoid'}
    }
}