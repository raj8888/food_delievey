const mongoose=require('mongoose')

let menuSchema=mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    resID:String
})

let menuModel= mongoose.model("menu",menuSchema)

module.exports={
    menuModel
}