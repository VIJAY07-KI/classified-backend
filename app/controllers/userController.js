import User from "../models/userModel.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import  {body, validationResult}  from 'express-validator'
const userCtrl={}
userCtrl.register=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    const body=req.body
    try{
        const user=new User(body)
        // const user1=await User.findOne({role:'admin'})
        // if(user1&& user.role){
        //     return res.status(400).json({error:'admin is already exists'})
        // }
        const count=await User.countDocuments()
        const salt=await bcryptjs.genSalt()
        const hash=await bcryptjs.hash(body.password,salt)
        user.password=hash
        if(count==0){
            user.role='admin'
            user.isActive="true"
        }
        if(count>0 && user.role=='admin'){
            return res.status(400).json({error:'admin is already exists'})
        }
        if(count>0 && !user.role){
            return res.status(400).json({error:'role field is required'})
        }
        if(user.role=='buyer'){
            user.isActive=true
        }
        if(!['admin','seller','buyer'].includes(user.role)){
            return res.status(400).json({error:'please provide valid role either be seller or buyer'})
        }
       
        await user.save()
        res.status(201).json(user)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}

userCtrl.list=async(req,res)=>{
    try{
        const users=await User.find()
        res.json(users)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Something went wrong'})
    }
}


userCtrl.login=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    const {email,password,isActive}=req.body
    try{
        const user=await User.findOne({email})
        if(!user){
            return res.status(404).json({error:'invalid email/pasword'})
        }
        const isVerified=await bcryptjs.compare(password,user.password)
        const isActive= user.isActive
        if(!isVerified){
            return res.status(404).json({error:'invalid email/password'})
        }
        if(!isActive){
            return res.status(404).json({error:"you cannot be login,please contact to admin"})
        }
        const tokenData={userId:user._id,role:user.role}
        const token= jwt.sign(tokenData,process.env.SECRET,{expiresIn:'7d'})
        res.json({token})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}

userCtrl.account=async(req,res)=>{
    try{
        const user=await User.findById(req.userId)
         return res.json(user)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }

}
//account delete using by user cridential or admin
userCtrl.remove=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    const id=req.params.id
    try{
        const admin = await User.findById(id)
        if(admin.role=="admin"){
            return res.status(400).json({message:"admin account cannot be delete" })
        }else{
            if(id==req.userId || req.role=='admin'){
                const user=await User.findByIdAndDelete(id)
                 return res.json(user)
                }
                res.json({error:'cannot delete this account, user is invalid'})

        }
        // console.log(id)
        // console.log(req.userId)
        
    }catch(err){
        res.status(500).json({error:'something went wrong'})
    }
}

//update user accont
userCtrl.modify=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    const id=req.params.id
    let {name,email,password}=req.body
    try{
        // role=req.role
        // isActive=req.isActive
        // password=req.password
        const salt=await bcryptjs.genSalt()
        const hashed=await bcryptjs.hash(password,salt)
        password=hashed
     if(id==req.userId){
        const user=await User.findByIdAndUpdate(id,{name,email,password},{new:true})
        return res.status(201).json(user)
     }
     res.json({error:'cannot update this account user is invalid'})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
    

}

//update Activaton 
userCtrl.update=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    const id=req.params.id
    const {isActive}=req.body
    try{
      // body.isActive="true"
        const user=await User.findByIdAndUpdate(id,{isActive},{new:true})
        res.json(user)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}


export default userCtrl