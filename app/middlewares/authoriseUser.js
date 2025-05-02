export const authoriseUser=(permittedRoles)=>{
return (req,res,next)=>{
    if(permittedRoles.includes(req.role)){
        next()
    }else{
        return res.status(403).json({error:'Unauthorized access'})
    }

}
}