import User from "../models/userModel.js"



         


export const registerValidationSchema={
    name:{
        in:['body'],
        exists:{errorMessage:'name field is required'},
        notEmpty:{errorMessage:'name field should not be  empty'},
        isLength:{min:3},
        trim:true
    },
    email:{
        in:['body'],
        exists:{errorMessage:'email field is required'},
        notEmpty:{errorMessage:'email field should not be  empty'},
        isEmail:{errorMessage:'email should be valid format'},
        normalizeEmail:true,
        trim:true,
        custom:{
            options:async function(value){
                try{
                    const user=await User.findOne({email:value})
                    if(user){
                        throw new Error('Email is already taken try with new one')
                    }
                }catch(err){
                        throw new Error(err.message)
                    }
                    return true
            }
            
        }
    },
    password:{
        in:['body'],
        exists:{errorMessage:'password field is required'},
        notEmpty:{errorMessage:'password field should not be  empty'},
        isStrongPassword:{Options:{minLength:8,minLowercase:1,minUppercase:1,minNumber:1,minSymbol:1},
        errorMessage:'password must contain atleast one lowercase,one uppercase,one number,one symbol and minmum of 8 characters'
     },
     trim:true
    },
    //  role:{
     
    // custom:{
    //     Options:async function(){
    //         try{
    //         const count=User.countDocuments()
    //         if(count>0){
    //             throw new Error('role field is required')
    //         }
    //     }catch(err){
    //         throw new Error(err.message)
    //     }
    //     }
    // }

    // }
    // isActive:{
    //     in:['body'],
    // //     exists:{errorMessage:'isActive field is required'},
    // //     notEmpty:{errorMessage:'isActive field should not be  empty'}, 
    //     default:'false'
    //  }
}


export const loginValidationSchema={
    email:{
        in:['body'],
        exists:{errorMessage:'email field is required'},
        notEmpty:{errorMessage:'email field is not empty'},
        isEmail:{errorMessage:'please provide valid format'},
        normalizeEmail:true,
        trim:true
    },
    password:{
        in:['body'],
        exists:{errorMessage:'password field is required'},
        notEmpty:{errorMessage:'password field is not empty'},
        isStrongPassword:{
            options:{minLength:8,minLowercase:1,minNumber:1,minSymbol:1,minUppercase:1}
        },
        trim:true


    }
}