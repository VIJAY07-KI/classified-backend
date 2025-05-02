
import Product from "../models/productModel.js"

const productCtrl={}
//list of all-productsreturn
productCtrl.list=async(req,res)=>{
    try{
        const products=await Product.find()
        res.json(products)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Something went wrong'})
    }
}

//create a product
productCtrl.create=async(req,res)=>{
    const {name,price,description,images,category,seller}=req.body
    try{
        const product=await Product({name,price,description,images,category,seller})
        product.seller=req.userId
        await product.save()
        res.status(201).json(product)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Something went wrong'})
    }
}
 //update a product
 productCtrl.modify=async(req,res)=>{
    const id=req.params.id
    const {name,price,description,images,category,seller}=req.body
    try{
        const existProduct= await Product.findById(id)
        if(existProduct.seller==req.userId){
        //seller=req.userId
        const product=await Product.findByIdAndUpdate(id,{name,price,description,images,category,seller:req.userId},{new:true})
        if(!product){
             res.status(404).json({error:'Product not found'})
        }
        res.json(product)
    }else{
            res.json({message:"You cannot update this product"})
        }
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}


//delete product
productCtrl.remove=async(req,res)=>{
    const id=req.params.id
    try{
        const existProduct= await Product.findById(id)
        if(existProduct.seller==req.userId){
        const product=await Product.findByIdAndDelete(id)
        if(!product){
            res.status(404).json({error:'Product not found'})
        }
        res.json(product)
    }else{
        res.json({message:"you cannot delete this product"})
    }
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
//isProvense
productCtrl.approve=async(req,res)=>{
    const id=req.params.id
    const{isApproved}=req.body
    try{
        const product=await Product.findByIdAndUpdate(id,{isApproved},{new:true})
        if(!product){
            res.status(404).json({error:'Product not found'})
        }
        res.json(product)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
//show products that related seller
productCtrl.show=async(req,res)=>{
    const userId=req.userId
    try{
        const product=await Product.find({seller:userId})
        
         res.json(product)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
//show product by Id
productCtrl.showProduct=async(req,res)=>{
    const id=req.params.id
    try{
        const product=await Product.findById(id)
        if(!product){
            return res.status(404).json({error:'product not found'})
        }
        product.views++//c+=1
        product.save()
        res.json(product)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}


//addEnquiry
productCtrl.addEnquiry=async(req,res)=>{
    const id=req.params.id
    const {message}=req.body
    try{
        const product=await Product.findById(id)
        //console.log(product)
        if(!product){
            res.status(404).json({error:'Product not found'})
        }
        //buyer=req.userId
        const addEnq={buyer:req.userId,message,}
        product.enquires.push(addEnq)
        await product.save()
        res.json(product)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}

//respond2Enquiry
productCtrl.respondEnquiry=async(req,res)=>{
    //console.log(req.params.id)
    const id=req.params.id
    const {enquiryId,response}=req.body
    try{
        const product=await Product.findById(id)
        if(!product){
            res.status(404).json({error:'Product not found'})
        }
        const enquiry=product.enquires.id(enquiryId)
        if(!enquiry){
            res.status(404).json({error:'Enquiry not found'})
        }
        enquiry.response=response
        //console.log(enquiry.response)
        await product.save()
        res.json(product)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'}) 
    }
}
//Remove Enquiries
productCtrl.removeEnquiry=async(req,res)=>{
    const {id,enqid}=req.params
    //const {enquiryId}=req.body
    //console.log(enquiryId)
    try{
        const product=await Product.findById(id)
        if(!product){
           return  res.status(404).json({error:'Product not found'})
        }
        const res1= product.enquires.findIndex(ele=>ele.id==enqid)
        product.enquires.splice(res1,1)
        // console.log(product)
        // product.enquires.push(res1)
        await product.save()
        return res.status(200).json(product,{ message: 'Enquiry deleted successfully.' });
    
        //res.json(product)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'}) 
    }
}

//updates views
productCtrl.views=async(req,res)=>{
    const id=req.params.id
    //const {views}=req.body
    try{
        const product=await Product.findById(id)

        if(!product){
            return  res.status(404).json({error:'Product not found'})
        }
        const views=product.views+1
        const Updatedproduct=await Product.findByIdAndUpdate(id,{views},{new:true})
        
        res.json(Updatedproduct)

    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'}) 
    }
}

//mark as Interested
productCtrl.markInterested=async(req,res)=>{
    const id=req.params.id
    
    try{
        const product=await Product.findById(id)
        if(!product){
            return res.status(404).json({error:'Product not found'})
        }
       const  buyer=req.userId 
        // console.log(buyer)
        //console.log(product.interestedBuyers)
       const buyerId= product.interestedBuyers.filter(ele=>ele.buyer==buyer)
        
        if(buyerId.length==0){
        product.interestedBuyers.push({buyer:buyer})
        await product.save()
        res.json(product)
        }else{
            return res.json('This buyer already there in this list')
        }
        
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Something went wrong'})
    }
}
//remove from markInterested
productCtrl.removeInterested=async(req,res)=>{
    const id=req.params.id
    try{
        const product=await Product.findById(id)
        if(!product){
            return res.status(404).json({error:'Product not found'})
        }
        const buyer=product.interestedBuyers.findIndex(ele=>ele.buyer==req.userId)
        product.interestedBuyers.splice(buyer,1)
        await product.save()
        res.json(product)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }

}
export default productCtrl