const express = require("express")
const authorization=require("../middleware/postmiddleware")
const Router = express.Router()
const OrderModel = require("../model/orders");

Router.post("/new",authorization,async(req,res)=>{
    try {
        const {quantity,totalprice,products,Arriving,email,status}=req.body
        if(!quantity||!totalprice||!products||!Arriving){
            return req.status(400).json({msg:"please provide all the order details"})
        }
        const DatatoDb= new OrderModel({quantity,totalprice,products,Arriving,email,status:"completed"})
            await DatatoDb.save()
            return res.status(200).json({msg:"order completed"})
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:"Internal server error"})
    }

})
Router.get("/details",authorization,async(req,res)=>{
    try {
       const{email}=req.body
       
        const DatafromDb=await OrderModel.find({email})
           
            return res.status(200).json(DatafromDb)
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:"Internal server error"})
    }

})
Router.get("/one/:id",authorization,async(req,res)=>{
    try {
       const{id}=req.params
       
        const DatafromDb=await OrderModel.findByid(id)
           
            return res.status(200).json(DatafromDb)
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:"Internal server error"})
    }

})
Router.put("/update/:id",authorization,async(req,res)=>{
    try {
       const{id}=req.params
       const status=req.body.status
        const DatafromDb=await OrderModel.findByid(id)
           DatafromDb.status=status
           await DatafromDb.save()
            return res.status(200).json({msg:"orderd canceld"})
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:"Internal server error"})
    }

})
module.exports=Router
