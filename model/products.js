const mongoose = require("mongoose")

const notesschema = mongoose.Schema({
    img:String,
    title: String,
    brand:String,
    price: String,
    colour:String,
    category:{type:String,required:true},
    email:{type:String,required:true}
}, {
    versionKey: false
})
const mensmodel = mongoose.model("mens", notesschema)
module.exports = mensmodel