const express = require("express")
const Routes = express.Router()
const ProductsModel = require("../model/products");
const authentication=require("../middleware/postmiddleware")
const Authorization=require("../middleware/Rolecheck");
const UsersModel=require("../model/reg")

Routes.post("/Products/add",authentication,Authorization(["seller","Admin","superadmin"]),  async (req, res) => {
    try {
        const Data = req.body;
        if (Data) {
            replacedoolor(Data)
            await ProductsModel.insertMany(Data);
             return res.status(200).json({ "msg": ` data added` });
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
  if(!DatafromDb){
   return res.status(400).json({ msg: "You do not have any prduct with us"});
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
        const {email,authority}=req.body
        if(!authority=="superadmin"||!authority=="Admin"){
            res.status(400).json({ "msg": "Please provide valid neq authority" })
        }
        const email={email:email}
        const role={role:authority}
        const DatafromUsers=await UsersModel.findOneAndUpdate(email,role)
        return res.status(200).json({msg:`Role of ${DatafromUsers.name} changed to ${authority} from ${DatafromUsers.role}`});
    } catch (error) {
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



module.exports = Routes

  
