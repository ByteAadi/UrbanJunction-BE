const express = require("express")
const authorization=require("../middleware/postmiddleware")
const AddressModel = require("../model/address")
const Router = express.Router()

Router.post("/new",authorization,async(req,res)=>{
    try {
        const { country,state,contact,street,zipcode, houseno,email}=req.body
        if(!country||!state||!contact||!street||!zipcode || !houseno||!contact.length==10){
            return req.status(400).json({msg:"please provide all the address details"})
        }
        const DatatoDb = new AddressModel({country,state,contact,street,zipcode, houseno,email})
            await DatatoDb.save()
            return res.status(200).json({msg:"order completed"})
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:"Internal server error"})
    }

})
Router.put("/new",authorization,async(req,res)=>{
    try {
        const { country,state,contact,street,zipcode, houseno,email}=req.body
        if(!country||!state||!contact||!street||!zipcode || !houseno||!contact.length==10){
            return req.status(400).json({msg:"please provide all the address details"})
        }
        const data= await AddressModel.findOne({email})
        if (!data) {
            return res.status(404).json({ msg: "Address not found." });
          }      
        data.country=country
        data.state=state
        data.contact=contact
        data.houseno=houseno
        data.street=street
        data.zipcode=zipcode
       
            await data.save()
            return res.status(200).json({ msg: "Address updated successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:"Internal server error"})
    }

})
      
Router.put("/get",authorization,async(req,res)=>{
    try {
        const { email}=req.body
       
        const data= await AddressModel.findOne({email})
        if (!data) {
            return res.status(404).json({ msg: "please add address" });
          }      
       
            return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:"Internal server error"})
    }

})       
          
         
           
  module.exports=Router      