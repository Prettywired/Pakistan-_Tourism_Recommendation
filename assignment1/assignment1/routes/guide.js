const Users = require("../models/User");
const Cities = require("../models/City");
const Guide = require("../models/Guide");
var express = require("express");
var router = express.Router();

router.get("/searchByCityName", async(req, res)=>{
    try{
        const cities= await Cities.findOne({ name: req.body.name })
        const guide= await Guide.find({city:cities})
        if (guide.length===0) return res.json({ msg: "NO GUIDES FOUND" })
        res.json({ msg: "GUIDES FOUND", data: guide })
    }
    catch(error){
        console.error(error);
    }
})
router.get("/searchByName", async(req, res)=>{
    try{
        const guide = await Guide.findOne({name: req.body.name})
        if(!guide) return res.json({msg: "GUIDE NOT FOUND"})
        res.json({msg: "GUIDE FOUND", data: guide})
    }
    catch(error){
        console.error(error);
    }
})

router.use((req, res, next) => {
    if (!req.user.admin) return res.json({ msg: "NOT ADMIN" })
    
    else next()
}) //since we are using a middleware here, all further requests can only be accessed via admin

router.post("/addGuide", async (req, res)=>{
    try{
        const city = await Cities.findOne({name: req.body.city})
        if(!city) return res.json({msg: "CITY DOES NOT EXIST"})
        const guide = await Guide.findOne({email: req.body.email})
        if(guide) return res.json({msg: "GUIDE EXISTS"})
        let checkGuideName = /^[a-zA-Z\s]+$/
        if(!checkGuideName.test(req.body.name)){
            return res.json({msg: "Guide name needs to be valid"})
        } 
        const contact = await Guide.findOne({contact: req.body.contact})
        
        if(city.province !== req.user.province  &&req.user.superAdmin===false)
        return res.json({msg: "This admin is not allowed to add a Guide to this city in this province."})
        await Guide.create({ ...req.body, city: city._id })
        res.json({ msg: "Guide ADDED" })

    }
    catch(error){
        console.error(error);
    }
})
router.post("/deleteGuide", async (req, res)=>{
    try{
        const guide = await Guide.findOne({ name: req.body.name })
        if (!guide) return res.json({ msg: "GUIDE NOT FOUND" })
        const cities=guide.city
        if(cities.province!==req.user.province &&req.user.superAdmin===false)
        return res.json({msg: "This admin is not allowed to delete a guide from this city in this province."})
        await Guide.deleteOne({ name: req.body.name })
        res.json({ msg: "GUIDE DELETED" })
    }
    catch(error){
        console.error(error);
    }
})

module.exports = router;