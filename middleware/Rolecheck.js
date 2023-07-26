const { checkout } = require("../routes/login");

function CheckRole(AuthorizeRoles){
    return (req,res,next)=>{
        try {
            const {role}=req
            console.log(req);
            if(AuthorizeRoles.includes(role)){
                return next()
            }else{
              return  res.status(400).json({msg:"Not authorized"})
            }
        } catch (error) {
            console.error(error);
            return  res.status(400).json({msg:"Internal server error"})
        }
    }
}
module.exports=CheckRole
