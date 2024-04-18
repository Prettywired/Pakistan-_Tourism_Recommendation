const Users = require("../models/User");
const Transports = require("../models/Transport");
const Cities=require("../models/City");
var express = require("express");
var router = express.Router();


router.post("/getByCity", async (req,res)=>{
    try{
    const city = await Cities.findOne({name: req.body.city})
    const transport = await Transports.find({city: city})
    if(!city) return res.json({msg: "CITY DOES NOT EXIST"})
    if(transport.length===0) return res.json({msg: "NO TRANSPORT FOUND"})
    return res.json({msg: "TRANSPORT FOUND", data : transport})
    } catch(error) {
        console.error(error);
    }
    })
    
router.post("/getByType",async (req,res)=>{
    try{
    const type = await Transports.findOne({type : req.body.type})
    if(!type) return res.json({msg: "TYPE DOES NOT EXIST"})

    const transport = await Transports.find({type: req.body.type})
    if(transport.length===0) return res.json({msg :"NO TRANSPORT FOUND"})
    return res.json({msg: "TRANSPORT FOUND", data: transport})
    }catch(error) {
        console.log(error);
    }

})
     
router.post("/getByCityandType", async (req,res)=>{
    try{
    const city = await Cities.findOne({name: req.body.city})
    if(!city) return res.json({msg: "CITY DOES NOT EXIST"})
    const type = await Transports.findOne({type: req.body.type})
    if(!type) return res.json({msg: "TYPE DOES EXIST"})
    const transport = await Transports.find({city: city, type: req.body.type})
    if(transport.length===0) return res.json({msg: "NO TRANSPORT FOUND"})
    return res.json({msg: "TRANSPORT FOUND", data: transport})
    }
    catch(error){
        console.error(error);
    }
})
router.get("/getAll", async (req, res)=>{
    try{
    const transport = await Transports.find()
    if(transport.length===0) return res.json({msg: "NO TRANSPORT FOUND"})
    return res.json({msg: "TRANSPPORT FOUND", data: transport})
    } catch(error){
        console.error(error);;
    }
})
router.use((req, res, next) => {
    if (!req.user.admin) return res.json({ msg: "NOT ADMIN" })
    else next()
})

router.put("/addTransport", async (req, res) => {
    try {
        const city = await Cities.findOne({ name: req.body.city }); 
       const transport = await Transports.findOne({ type: req.body.type, city: city._id, company: req.body.company });
        if (transport) return res.json({ msg: "TRANSPORT EXISTS" });
        if (!city) return res.json({ msg: "CITY NOT FOUND" });
        
        let checkTransport = /^[a-zA-Z\s]+$/;
        if (!checkTransport.test(req.body.type)) {
            return res.json({ msg: "Transport Type needs to be valid" });
        }
        
        if (city.province !== req.user.province&&req.user.superAdmin===false) {
            return res.json({ msg: "This admin is not allowed to add a Transport to this city in this province." });
        }
        
        await Transports.create({ ...req.body, city: city._id }); 
        res.json({ msg: "TRANSPORT ADDED" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.delete("/deleteByTransportID",async  (req,res)=>{
    try{
        const transport = await Transports.findOne({_id: req.body._id})
        if(!transport) return res.json({msg: "NO TRANSPORT FOUND"})

        const city = await Cities.findOne({_id: transport.city})
        if(city.province!==req.user.province&&req.user.superAdmin===false) return res.json({msg: "This admin is not allowed to delete a Transport from this city in this province"})
        await Transports.deleteOne({_id: req.body._id});
        return res.json({msg: "TRANSPORT DELETED"});
    }
    catch(error){
        console.error(error);
    }
})
module.exports = router;