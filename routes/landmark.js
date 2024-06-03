const Users = require("../models/User");
const Landmarks = require("../models/Landmark");
const Cities=require("../models/City");
var express = require("express");
var router = express.Router();

router.post("/getByName", async (req, res) => {
    try {
        const landmark = await Landmarks.findOne({ name: req.body.name})
        if (!landmark) return res.json({ msg: "LANDMARK NOT FOUND" })
        res.json({ msg: "LANDMARK FOUND", data: landmark})
    } catch (error) {
        console.error(error)
    }
});

router.post("/getByNameWithCity", async (req, res) => {
    try {
        const landmark = await Landmarks.findOne({ name: req.body.name }).populate("city")
        if (!landmark) return res.json({ msg: "LANDMARK NOT FOUND" })
        res.json({ msg: "LANDMARK FOUND", data: landmark })
    } catch (error) {
        console.error(error)
    }
});
router.post("/getByCityName", async (req, res) => {
    try {
        const cities= await Cities.findOne({ name: req.body.name })
        const landmarks= await Landmarks.find({city:cities})
        if (landmarks.length==0) return res.json({ msg: "NO LANDMARKS FOUND" })
        res.json({ msg: "LANDMARKS FOUND", data: landmarks })
    } catch (error) {
        console.error(error)
    }
});
router.get("/getAll", async (req, res) => {
    try {
        const landmark = await Landmarks.find().populate("city")
        if (landmark.length==0) return res.json({ msg: "LANDMARKS NOT FOUND" })
        res.json({ msg: "LANDMARKS FOUND", data: landmark })
    } catch (error) {
        console.error(error)
    }
});


router.use((req, res, next) => {
    if (!req.user.admin&& req.user.superAdmin==false) return res.json({ msg: "NOT ADMIN" })
    else next()
})//since we are using a middleware here, all further requests can only be accessed via admin

router.put("/addLandmark", async (req, res) => {
    try {
        const city = await Cities.findOne({ name: req.body.city })
        const landmark=await Landmarks.findOne({name: req.body.name})
        if (landmark) return res.json({ msg: "LANDMARK EXISTS" })
        if (!city) return res.json({ msg: "CITY NOT FOUND" })
        let checkLandmark=/^[a-zA-Z\s]+$/
        if(!checkLandmark.test(req.body.name)){ //checking landmark name as it can only be alphabets
return res.json({msg: "Landmark pname needs to be in letters."})
        }
        if(city.province!=req.user.province&& req.user.superAdmin==false)
       
        return res.json({msg: "This admin is not allowed to add a landmark from this city in this province."})
        await Landmarks.create({ ...req.body, city: city._id })
        res.json({ msg: "LANDMARK ADDED" })
    } catch (error) {
        console.error(error)
    }
});

router.post("/deleteByName", async (req, res) => {
    try {
        const landmark = await Landmarks.findOne({ name: req.body.name })
        if (!landmark) return res.json({ msg: "LANDMARK NOT FOUND" })
        let cities=landmark.city
        if(cities.province!=req.user.province && req.user.superAdmin==false){
        console.log(cities.province)
        return res.json({msg: "This admin is not allowed to delete a landmark from this city in this province."})}
        await Landmarks.deleteOne({ name: req.body.name })
        res.json({ msg: "LANDMARK DELETED" })
    } catch (error) {
        console.error(error)
    }
});

module.exports = router