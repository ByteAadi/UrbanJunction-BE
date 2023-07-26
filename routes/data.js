const express = require("express")
const Routes = express.Router()
const ProductsModel = require("../model/products");
const authentication=require("../middleware/postmiddleware")
const Authorization=require("../middleware/Rolecheck");
const UsersModel=require("../model/reg")

Routes.post("/Products/add",authentication,Authorization(["seller","Admin","superadmin"]),  async (req, res) => {
    try {
       const {email,category,Data}=req.body
       const updatedData=AddCatAndEmail(email,Data,category)

        if (updatedData) {
            replacedoolor(updatedData)
           
            await ProductsModel.insertMany(updatedData);
             return res.status(200).json({ "msg": `data added` });
        }else{
            return res.status(400).json({ "msg": "please provide the data" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "msg": "Internal server error" });
    }
})
Routes.get("/products/show", async (req, res) => {
    try {
        let query = {};
        if (req.query.title) {
            query.title = { $regex: req.query.title, $options: "i" };
        }
        if (req.query.brand) {
            query.brand = { $regex: req.query.brand, $options: "i" };
        }
        if (req.query.category) {
            query.category = { $regex: req.query.category, $options: "i" };
        }

        const sort = {};
        if (req.query.sbp) {
            if (req.query.sbp === "asc") {
                sort.price = 1;
            } else if (req.query.sbp === "desc") {
                sort["price"] = -1;
            }
        }
        const limit = req.query.page ? 20 : 0;
        const skip = (req.query.page - 1) * limit;
        const notes = await ProductsModel.find(query).skip(skip).limit(limit).sort(sort);
        res.status(200).json(notes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }

})
Routes.get("/product/one/:id", async (req, res) => {

    try {
        if (req.params) {
            const { id } = req.params
            const data = await ProductsModel.findById(id)
            res.status(200).json(data)
        }
        else {
            res.status(404).json({ "msg": "please provide the id" })
        }
    } catch (error) {
     
        console.log(error);
        res.status(500).json({ "msg": "Internal server error" })
    }
})



Routes.delete("/product/deleteone/:id", authentication, Authorization(["seller", "Admin", "superadmin"]), async (req, res) => {
    try {
      const { id } = req.params;

      if(req.role==="Admin"||req.role==="superadmin"){
        const DatafromDb=await ProductsModel.findOneAndDelete({_id: id})
        return res.status(200).json({"msg": "Data deleted successfully."});
    }else{

      const { email } = req.body;
  
      if (id && email) {
       
        const data = await ProductsModel.findOneAndDelete({ _id: id, email: email });
  
        if (data) {
          res.status(200).json({ "msg": "Data deleted successfully." });
        } else {
          res.status(404).json({ "msg": "No matching product found for the provided ID and email." });
        }
      } else {
        res.status(400).json({ "msg": "Please provide both ID and email." });
      }
    }
    } catch (error) {
      console.log(error);
      res.status(500).json({ "msg": "Something went wrong, please try again later." });
    }
  });
  Routes.get("/products/seller",authentication, Authorization(["seller", "Admin", "superadmin"]),async (req, res) => {
try {
    if(req.role==="Admin"||req.role==="superadmin"){
        const DatafromDb=await ProductsModel.find()
        return res.status(200).json(DatafromDb);
    }else{
    const {email}=req.body
  const DatafromDb=await ProductsModel.find({email})
  if(!DatafromDb.length){
   return res.status(200).json({ msg: "You do not have any prduct with us"});
  }
  return res.status(200).json(DatafromDb);
}
} catch (error) {
    console.log(error);
    res.status(500).json({ "msg": "Something went wrong, please try again later." });
}
})
Routes.put("/change/role",authentication,Authorization([ "superadmin" ]),async(req,res)=>{
   try {
  const { emailtochange, authority } = req.body;

  const query = { email: emailtochange };
  const update = { role: authority };
  //  const DatafromUsers=await UsersModel.findOne({email:emailtochange})
  //      console.log(DatafromUsers)
  // DatafromUsers.role=authority
  //    await  DatafromUsers.save()
  const updatedUser = await UsersModel.findOneAndUpdate(query, update, { new: true });
console.log(updatedUser)


  return res.status(200).json({ msg: `Role  changed to ${authority}` });
} catch (error) {
  res.status(500).json({ msg: "Something went wrong, please try again later." });
  console.error(error);
}

})
Routes.get("/users/get",authentication, Authorization(["Admin", "superadmin"]),async (req, res) => {
    try {
        let query = {};
        if (req.query.email) {
            query.email = { $regex: req.query.email, $options: "i" };
        }
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: "i" };
        }
        if (req.query.role) {
            query.role = { $regex: req.query.role, $options: "i" };
        }
        const notes = await UsersModel.find(query).select('-password');

        if(!notes.length){
            return  res.status(200).json({msg:"sorry this email is not linked to any userID"})
        }
        res.status(200).json(notes)
    } catch (error) {
        console.log(error);
        res.status(500).json({ "msg": "Something went wrong, please try again later." });
    }
    })
    Routes.put("/block/user",authentication,Authorization([ "Admin","superadmin" ]),async(req,res)=>{
        try {
            const {useremail,isblock}=req.body
            if(typeof(isblock)!=="boolean"){
                return  res.status(400).json({msg:"new block status must be provided in boolean"})
            }
            const{role}=req
            const DatafromUsers=await UsersModel.findOne({email:useremail})
            if(role==="Admin" && DatafromUsers.role==="superadmin"){
                return res.status(400).json({msg:"Admin cannot change the block status of superadmin"})
            }
            DatafromUsers.Blocked=isblock
            console.log( DatafromUsers)
            await DatafromUsers.save()
            return res.status(200).json({msg:"Block status changed"});
        } catch (error) {
            console.log(error)
            res.status(500).json({ "msg": "Something went wrong, please try again later." });
        }
    })
function replacedoolor(data) {
    if (data) {

        data.forEach(element => {
            if (element && element.price) {
                element.price = element.price.replaceAll("$", "")
            }
        });
    }
}
function AddCatAndEmail(email,data,category){
    for(let i=0;i<data.length;i++){
        if(!data[i].img){
            return data.splice(0,i)
        }
        data[i].email=email
        data[i].category=category
    }
    return data;
}


module.exports = Routes

  
