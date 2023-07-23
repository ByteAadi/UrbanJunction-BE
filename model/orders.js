const mongoose = require("mongoose")

const OrederSchema = mongoose.Schema({
    quantity:String,
   totalprice:Number,
   products:Array,
    address:String,
   Arriving:String,
   email:String,
   status:String
}, {
    versionKey: false
})
const OrdersModel = mongoose.model("orders", OrederSchema)
module.exports = OrdersModel
