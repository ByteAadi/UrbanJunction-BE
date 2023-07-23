const mongoose = require("mongoose")

const AddressSchema = mongoose.Schema({
    country:String,
    state:String,
    contact:String,
    street:String,
     zipcode:String,
     houseno:Number,
     email:String
}, {
    versionKey: false
})
const AddressModel = mongoose.model("adress",AddressSchema)
module.exports =AddressModel
