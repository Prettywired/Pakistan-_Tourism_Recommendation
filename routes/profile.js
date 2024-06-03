const express=require("express");
const bcrypt=require("bcrypt");
var router=express.Router();
const Users= require("../models/User");



router.post("/updatePassword", async (req, res) => {
 
       
        const user = await Users.findOne({ email: req.body.email });
        if (!user) {
            return res.json({ msg: "User not found" });
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.oldPassword, user.password);

        if (!isPasswordCorrect) {
            return res.json({ msg: "Old password is incorrect" });
        }

        const newPassword = await bcrypt.hash(req.body.newPassword, 5);

        await Users.updateOne({ email: req.body.email }, { $set: { password: newPassword } });
        return res.json({ msg: "Password updated successfully" });
  
});

router.post("/viewProfile", async (req, res)=>{
    try{
    const user=await Users.findOne({email:req.user.email})

    if(!user){
        return res.json({msg: "User not found"});
    }
    return res.json({msg:"User Found", data:user})}
catch(error) {
    console.error(error)
}
})
//since anyone can change their password we only have
module.exports=router;