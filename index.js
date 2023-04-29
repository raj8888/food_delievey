const express=require("express")
const{connection}=require("./config/db")
const {userRouter}=require("./routes/user.route")
const {resRouter}=require("./routes/restaurants.route")
const {orderRouter}=require("./routes/orders.route")
require('dotenv').config()

const app=express()

app.use(express.json())
app.use("/users",userRouter)
app.use("/restaurants",resRouter)
app.use("/orders",orderRouter)

app.get("/",(req,res)=>{
    res.send("HOME PAGE")
})

app.listen(process.env.port,async()=>{
    try {
        await connection 
        console.log("Connected to db")
    } catch (error) {
        console.log(error)
    }
    console.log(`listining on port ${process.env.port}`)
})