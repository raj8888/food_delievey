const mongoose=require('mongoose')

let orderSchema=mongoose.Schema({
	 userID: String,
	 restaurantID : String,
     userName:String,
     restaurantName:String,
     items: [{
     name: String,
     price: Number,
     quantity: Number
     }],
    totalPrice: Number,
    deliveryAddress: {
     street: String,
     city: String,
     state: String,
     country: String,
     zip: String
   },
   status: String // e.g, "placed", "preparing", "on the way", "delivered"
  })


let orderModel=mongoose.model("orders",orderSchema)

module.exports={
    orderModel
}