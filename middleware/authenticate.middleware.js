require('dotenv').config()
var jwt = require('jsonwebtoken');

const authenticate=(req,res,next)=>{
    let token=req.headers.authorization?.split(" ")[1]
    if(!token){
        res.status(201).send({"Message":"Please Login Again"})
    }else{
        var decoded = jwt.verify(token, process.env.seckey);
       if(decoded){
        let userID=decoded.userID
        req.body.userID=userID
        next()
       }else{
        res.status(201).send({"Message":"Please Login Again"})
       }
    }
}

module.exports={
    authenticate
}