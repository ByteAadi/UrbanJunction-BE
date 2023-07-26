const express = require("express")
const Authorization = express.Router()
const bcrypt = require("bcrypt")
const reg_model = require("../model/reg")

const jwt = require("jsonwebtoken")
const validate=require("../middleware/postmiddleware")
Authorization.post("/signup", async (req, res) => {
  const { name, email, password ,role} = req.body
  console.log(req.body);
  try {
    const userr=await reg_model.findOne({email})
    console.log(userr);
    if(userr){
      return res.status(200).json({msg:"user already exist"})
    }
    bcrypt.hash(password, 8, async (err, hash) => {
      const datatodb = new reg_model({ name, email, password: hash,role })
      await datatodb.save()
      res.json({msg:"regestration success"})
      console.log(err);
    })

  } catch (error) {
    console.log(error)
    res.json("failed")
  }
})
  ;
Authorization.post("/login", async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await reg_model.findOne({ email })
    console.log(user);
    if(!user){
      return res.status(200).json({"msg": "Please regeister first"} )
    }
    if(user.Blocked){
      return res.status(400).json({msg:"Your account has been blocked and you are currently unable to access the system. This action has been taken due to a violation of our terms of service or community guidelines."})
    }
      bcrypt.compare(password, user.password, (err, result) => {
        console.log(err);
        console.log(password);

        if (!result) {
         return res.status(400).json({ "msg": "Wrong Credentials" })
        
        }
        return  res.status(200).json({ "msg": "Login successfull!", "token": jwt.sign({ email: user.email,role:user.role}, "masai"),name:user.name,email:user.email,role:user.role})
      });
    
    
  } catch (err) {
    res.status(400).json({ "msg": err.message })
    
  }
})



module.exports =  Authorization


