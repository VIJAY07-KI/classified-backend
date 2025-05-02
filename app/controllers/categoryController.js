import Category from "../models/categoryModel.js";
import { validationResult } from "express-validator";

const categoryCtrl={}
categoryCtrl.list=async(req,res)=>{
    try{
        const category=await Category.find()
        res.json(category)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
categoryCtrl.create=async(req,res)=>{
    const body=req.body
    try{
        const category=await Category.create(body)
        res.status(201).json(category)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Something went wrong'})
    }
}


categoryCtrl.show = async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const id = req.params.id;
    try{
        const category  = await Category.findById(id);
        if(!category){
            return res.status(404).json({error:"category not found"})
        }
        res.json(category)
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Something went wrong"})
    }
} 

categoryCtrl.update = async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = req.body;
    const id = req.params.id;
    try{
        const category = await Category.findByIdAndUpdate(id,body,{new:true});
        if(!category){
            return res.status(400).json({errors :"category not found"})
        }
        res.status(200).json(category)
    }catch(err){
        console.log(err);
        res.status(500).json({errors:"Something went wrong"})
    }
}


categoryCtrl.remove = async (req,res)=>{
    const errors = validationResult(req); 
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const id = req.params.id;
    try{
        const category = await Category.findByIdAndDelete(id);
        if(!category){
            return res.status(400).json({errors:"category not found"})
        }
        res.status(200).json(category)
    }catch(err){
        console.log(err);
        res.status(500).json({errors:"Something went wrong"})
    }
}

export default categoryCtrl

