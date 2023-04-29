const express=require("express")
const {resModel}=require("../models/restaurant.model")
const {menuModel}=require("../models//menu.model")
const{authenticate}=require("../middleware/authenticate.middleware")
require('dotenv').config()

const resRouter=express.Router()

resRouter.use(authenticate)

resRouter.get("/",async(req,res)=>{
    try {
        let data=await resModel.find()
        res.status(200).send({"allRes":data})
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})

resRouter.get("/:id",async(req,res)=>{
    try {
        let id=req.params.id
        let data=await resModel.findById({_id:id})
        if(!data){
            res.status(401).send({"Message":"Restaurant Not Found"})
        }else{
            res.status(200).send({"Res":data})
        }
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})

resRouter.get("/:id/menu",async(req,res)=>{
    try {
        let id=req.params.id
        let data=await resModel.findById({_id:id})
        if(!data){
            res.status(401).send({"Message":"Restaurant Not Found"})
        }else{
            res.status(200).send({"Menu":data.menu})
        }
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})

resRouter.post("/",async(req,res)=>{
    try {
        let data=req.body
        const rest=new resModel(data)
        await rest.save()
        res.status(201).send({"Message":"Restaurant created successfully"})
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }

})

resRouter.post("/:id/menu",async(req,res)=>{
    try {
        let id=req.params.id
        let findRes=await resModel.findById({_id:id})
        let data=req.body
        req.body.resID=id
        let newMenu=new menuModel(data)
        await newMenu.save()
        findRes.menu.push(newMenu)
        await findRes.save()
        res.status(201).send({"Message":"Created Menu for your restaurants"})
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})

resRouter.delete("/:resid/menu/:menuid",async(req,res)=>{
    try {
        let resid=req.params.resid
        let menuid=req.params.menuid
        await menuModel.findByIdAndDelete({_id:menuid})
        let dataRes=await resModel.findById({_id:resid})
        let newData=dataRes.menu.filter(elem=>{
            if(elem._id!=menuid){
                return elem
            }
        })
        await resModel.findByIdAndUpdate({_id:resid},{menu:newData})
        res.status(202).send({"Message":"Menu Deleted Successfully"})
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})

module.exports={
    resRouter
}