const mongoose=require('mongoose')

let resSchema=mongoose.Schema({
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String
    },
    menu: []
  })


let resModel=mongoose.model("restaurants",resSchema)

module.exports={
    resModel
}