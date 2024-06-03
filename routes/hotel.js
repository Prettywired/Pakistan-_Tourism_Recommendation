const Users = require("../models/User");
const Hotels=require("../models/Hotel")
const Cities=require("../models/City");
var express = require("express");
var router = express.Router();

router.post("/getByCompanyName", async (req, res) => {
    try {
        const hotel = await Hotels.find({name: req.body.name})
        if (hotel.length===0) return res.json({ msg: "HOTEL NOT FOUND" })
        res.json({ msg: "HOTEL FOUND", data: hotel})
    } catch (error) {
        console.error(error)
    }
});

router.post("/getByBranch", async (req, res) => {
    try {
        const hotel = await Hotels.findOne({ branch: req.body.name })
        if (!hotel) return res.json({ msg: "HOTEL NOT FOUND" })
        res.json({ msg: "HOTEL FOUND", data: hotel})
    } catch (error) {
        console.error(error)
    }
});
router.post("/getByCityName", async (req, res) => {
    try {
        const cities= await Cities.findOne({ name: req.body.name })
        const hotels= await Hotels.find({city:cities._id})
        if (hotels.length===0) return res.json({ msg: "NO HOTELS FOUND" })
        res.json({ msg: "HOTELS FOUND", data: hotels })
    } catch (error) {
        console.error(error)
    }
});
router.get("/getAll", async (req, res) => {
    try {
        const hotel = await Hotels.find().populate('city')
        if (hotel.length===0) return res.json({ msg: "HOTELS NOT FOUND" })
        res.json({ msg: "HOTELS FOUND", data: hotel})
    } catch (error) {
        console.error(error)
    }
});


router.use((req, res, next) => {
    if (!req.user.admin) return res.json({ msg: "NOT ADMIN" })
    else next()
})//since we are using a middleware here, all further requests can only be accessed via admin

router.put("/addHotel", async (req, res) => {
    try {
        const city = await Cities.findOne({ name: req.body.city })
        const hotel=await Hotels.findOne({branch: req.body.branch})
        if (hotel) return res.json({ msg: "HOTEL EXISTS" })
        if (!city) return res.json({ msg: "CITY NOT FOUND" })
        let checkHotel=/^[a-zA-Z\s]+$/
        if(!checkHotel.test(req.body.name)){ //checking hotel name as it can only be alphabets
return res.json({msg: "Hotel name needs to be in letters."})
        }
        if(city.province!==req.user.province&&req.user.superAdmin===false)
       
        return res.json({msg: "This admin is not allowed to add a hotel from this city in this province."})
        await Hotels.create({ ...req.body, city: city._id })
        res.json({ msg: "HOTEL ADDED" })
    } catch (error) {
        console.error(error)
    }
});

router.post("/deleteByBranch", async (req, res) => {
    try {
        const hotel= await Hotels.findOne({ branch: req.body.name })
        if (!hotel) return res.json({ msg: "HOTEL NOT FOUND" })
        const cities=await Cities.findOne({_id: hotel.city})
        if(cities.province!==req.user.province&&req.user.superAdmin===false) return res.json({msg: "This admin is not allowed to delete a hotel from this city in this province."})
        await Hotels.deleteOne({ branch: req.body.name })
        res.json({ msg: "HOTEL DELETED" })
    } catch (error) {
        console.error(error)
    }
});

module.exports = router