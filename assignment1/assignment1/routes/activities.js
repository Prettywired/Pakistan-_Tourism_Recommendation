const Activities =require("../models/Activities");
const Cities = require("../models/City");
const Landmarks=require("../models/Landmark");
var express = require("express");
var router = express.Router();

router.get("/getByName", async (req, res) => {
    try {
        const activity = await Activities.findOne({ name: req.body.name})
        if (!activity) return res.json({ msg: "ACTIVITY NOT FOUND" })
        res.json({ msg: "ACTIVITY FOUND", data: activity})
    } catch (error) {
        console.error(error)
    }
});
router.get("/getByCity", async (req, res) => {
    try {
        const cities= await Cities.findOne({ name: req.body.name })
        const activities= await Activities.find({city:cities})
        if (activities.length===0) return res.json({ msg: "NO ACTIVITIES FOUND" })
        res.json({ msg: "ACTIVITIES FOUND", data: activities })
    } catch (error) {
        console.error(error)
    }
});
router.get("/getByNameWithActivity", async (req, res) => {
    try {
        const activity = await Activities.findOne({ type: req.body.type }).populate("landmark")
        if (!activity) return res.json({ msg: "ACTIVITY NOT FOUND" })
        res.json({ msg: "ACTIVITY FOUND", data: activity })
    } catch (error) {
        console.error(error)
    }
});
router.get("/getAll", async (req, res) => {
    try {
        const activities = await Activities.find()
        if (activities.length===0) return res.json({ msg: "ACTIVITIES NOT FOUND" })
        res.json({ msg: "ACTIVITIES FOUND", data: activities })
    } catch (error) {
        console.error(error)
    }
});

router.get("/getByLandmark", async (req, res) => {
    try {
        const landmarks= await Landmarks.findOne({ name: req.body.name })
        const activities= await Activities.find({landmark:landmarks})
        if (activities.length===0) return res.json({ msg: "NO ACTIVITIES FOUND" })
        res.json({ msg: "ACTIVITIES FOUND", data: activities })
    } catch (error) {
        console.error(error)
    }
});



router.use((req, res, next) => {
    if (!req.user.admin) return res.json({ msg: "NOT ADMIN" })
    else next()
}) //since we are using a middleware here, all further requests can only be accessed via admin



router.put("/addActivity", async (req, res) => {
    try {
        const city = await Cities.findOne({ name: req.body.city })
        const activity = await Activities.findOne({ type: req.body.type})
        const landmark=await Landmarks.findOne({name:req.body.landmark})

        if (activity) return res.json({ msg: "ACTIVITY EXISTS" })

        if (!city) return res.json({ msg: "CITY NOT FOUND" })
    
        if (!landmark) return res.json({ msg: "LANDMARK NOT FOUND" })
     
        let checkActivity=/^[a-zA-Z\s]+$/
        if(!checkActivity.test(req.body.type)){
return res.json({msg: "Activity type needs to be in letters."})
        }
    
        if(city.province!==req.user.province &&req.user.superAdmin===false)
        return res.json({msg: "This admin is not allowed to add an activity from this city in this province."})
     
        await Activities.create({ ...req.body, city: city._id,landmark:landmark._id })
        res.json({ msg: "ACTIVITY ADDED" })
    } catch (error) {
        console.error(error)
    }
});

router.delete("/deleteByTypeAndLandmark", async (req, res) => {
    try {
        const activity = await Activities.findOne({ type: req.body.name })
        if (!activity) return res.json({ msg: "ACTIVITY NOT FOUND" })
        const cities=await Cities.findOne({_id:activity.city})
       const landmark = await Landmarks.findOne({name: req.body.landmark})
       if(!landmark) return res.json({msg : "LANDMARK DOES NOT EXIST"})
        if(cities.province!==req.user.province &&req.user.superAdmin===false)
        return res.json({msg: "This admin is not allowed to delete an activity from this city in this province."})
        await Activities.deleteOne({ type: activity , landmark: landmark})
        res.json({ msg: "ACTIVITY DELETED" })
    } catch (error) {
        console.error(error)
    }
});

module.exports = router