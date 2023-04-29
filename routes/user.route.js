const express=require("express")
const {userModel}=require("../models/user.model")
const{authenticate}=require("../middleware/authenticate.middleware")
const bcrypt = require('bcrypt');
require('dotenv').config()
var jwt = require('jsonwebtoken');

const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
    try {
        let data=req.body
        let email=data.email
        let findEmail=await userModel.findOne({email})
        if(findEmail){
            res.status(401).send({"Message":"User Already Registered"})
        }else{
            bcrypt.hash(data.password, 5, async(err, hash)=>{
                if(err){
                    console.timeLog(err)
                    res.status(401).send({"Message":"Server Error"})
                }else{
                    data.password=hash
                    const user=new userModel(data)
                    await user.save()
                    res.status(201).send({"Message":"User Register Successfully"})
                }
            });
        }
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})

userRouter.post('/login',async(req,res)=>{
    try {
        let data=req.body
        let email=data.email
        let findEmail=await userModel.findOne({email})
        if(findEmail){
            let hashpass=findEmail.password
            bcrypt.compare(data.password, hashpass, async(err, result)=>{
               if(err){
                console.log(err)
                res.status(401).send({"Message":"Server Error"})
               }else if(result){
                let token=jwt.sign({userID:findEmail._id},process.env.seckey)
                res.status(201).send({"Message":"User Login Succeessfully","token":token})
               }else{
                res.status(401).send({"Message":"Please correct credentials"})
               }
            });
        }else{
            res.status(401).send({"Message":"Please Register First"})
        }
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})


userRouter.patch('/:id/reset',async(req,res)=>{
    try {
        let data=req.body
        let newPass=data.newpassword
        let currPass=data.currpassword
        let id=req.params.id
        let findEmail=await userModel.findById({_id:id})
        let hashpass=findEmail.password
        bcrypt.compare(currPass, hashpass, async(err, result)=>{
           if(err){
            console.log(err)
            res.status(401).send({"Message":"Server Error"})
           }else if(result){
            bcrypt.hash(newPass, 5, async(err, hash)=>{
                if(err){
                    console.timeLog(err)
                    res.status(401).send({"Message":"Server Error"})
                }else{
                    await userModel.findByIdAndUpdate({_id:id},{password:hash})
                    res.status(204).send({"Message":"Password Update successfully"})
                }
            });
           }else{
            res.status(401).send({"Message":"Server Error"})
           }
        });
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})

module.exports={
    userRouter
}