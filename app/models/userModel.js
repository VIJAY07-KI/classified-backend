import {Schema,model} from 'mongoose'
const userRegisterSchema=new Schema({
    name:String,
    email:String,
    password:String,
    role:{type:String,enum:['admin','buyer','seller']},
    isActive:{type:Boolean,default:false}
},{timestamps:true})
const User=model('User',userRegisterSchema)
export default  User