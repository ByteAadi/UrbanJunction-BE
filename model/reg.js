const mongoose = require("mongoose")

const reg_schema = mongoose.Schema({
    name: { type: String,required:true},
    email: { type: String,required:true},
    password: { type: String,required:true},
     role:{type: String, required: true,default:"user",enum:["seller","user","Admin","superadmin"]}

})
const reg_model = mongoose.model("users", reg_schema)
module.exports = reg_model
