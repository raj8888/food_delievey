const mongoose=require('mongoose')

let userSchema=mongoose.Schema({
        name: String,
        email: String,
        password: String,
        address: {
          street: String,
          city: String,
          state: String,
          country: String,
          zip: String
        } 
})

let userModel=mongoose.model("users",userSchema)

module.exports={
    userModel
}