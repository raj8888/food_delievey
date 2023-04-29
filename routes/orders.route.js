const express=require("express")
const {resModel}=require("../models/restaurant.model")
const {userModel}=require("../models/user.model")
const {orderModel}=require("../models/order.model")
const {menuModel}=require("../models//menu.model")
const{authenticate}=require("../middleware/authenticate.middleware")
require('dotenv').config()


const orderRouter=express.Router()

orderRouter.use(authenticate)

orderRouter.post("/:resid/:menuid",async(req,res)=>{
    try {
        let resid=req.params.resid
        let menuid=req.params.menuid
        let userID=req.body.userID
        let data=req.body
        req.body.restaurantID=resid
        let userData=await userModel.findById({_id:userID})
        let menu=await menuModel.findById({_id:menuid})
        let resdata=await resModel.findById({_id:resid})
        let tempmenu=[]
        tempmenu.push(menu)
        let totalprize=0
        for(let i=0;i<tempmenu.length;i++){
            totalprize+=tempmenu[i].price
        }
        let newOrder=new orderModel({
            userID: userID,
	        restaurantID : resid,
            userName:userData.name,
            restaurantName:resdata.name,
            items: tempmenu,
            totalPrice: totalprize,
            deliveryAddress: userData.address,
            status: "preparing" // e.g, "placed", "preparing", "on the way", "delivered"
        })
        await newOrder.save()
        res.status(201).send({"Message":"Order successfully added."})
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})

orderRouter.get("/:id",async(req,res)=>{
    try {
        let id=req.params.id
        let order=await orderModel.findById({_id:id})
        res.status(200).send({"OrderDetails":order})
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})

orderRouter.patch("/:id",async(req,res)=>{
    try {
        let id=req.params.id
        let data=req.body
        await orderModel.findByIdAndUpdate({_id:id},{status:data.status})
        res.status(204).send({"Message":`Status updated to ${data.status}`})
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})

module.exports={
    orderRouter
}