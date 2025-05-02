import jwt from 'jsonwebtoken'
export  function userAuthenticate(req,res,next){
    const token=req.headers['authorization']
    if(!token){
        return res.status(401).json({error:'token is required'})
    }
    try{
        const tokenData=jwt.verify(token,process.env.SECRET)
        req.userId=tokenData.userId
        req.role=tokenData.role
        next()
    }catch(err){
        return res.status(401).json(err.message)

    }

}