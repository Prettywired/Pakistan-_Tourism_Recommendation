const Users = require("../models/User");
const Cities = require("../models/City");
var express = require("express");
var router = express.Router();

router.post("/getByCityName", async (req, res) => {
    try {
        console.log('req body: ',req.body);
        const city = await Cities.findOne({ name: req.body.name})
        if (!city) return res.json({ msg: "CITY NOT FOUND" })
        res.json({ msg: "CITY FOUND", data: city })
    } catch (error) {
        console.error(error)
    }
});
router.post("/getByProvinceName", async (req, res) => {
    try {
        const allCities = await Cities.find({ province: req.body.province})
        if (allCities.length === 0) {
            return res.json({ msg: "NO CITIES FOUND" });
        }
        res.json({ msg: "CITIES FOUND", data: allCities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
router.get("/getAll", async(req,res)=>{
    try {
        const allCities = await Cities.find();
        if (allCities.length === 0) {
            return res.json({ msg: "NO CITIES FOUND" });
        }
        res.json({ msg: "CITIES FOUND", data: allCities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
})

router.use((req, res, next) => {
    if (!req.user.admin && !req.user.superAdmin) return res.json({ msg: "NOT ADMIN" })
    
    else next()
}) //since we are using a middleware here, all further requests can only be accessed via admin



router.put("/addCity", async (req, res) => {
    try {
        const city = await Cities.findOne({ name: req.body.name})
        if (city) return res.json({ msg: "CITY EXISTS" })
        let checkCity=/^[a-zA-Z]+$/
        if(!checkCity.test(req.body.name)){
return res.json({msg: "City name needs to be in letters."})
        }
        if(req.body.province!=req.user.province && !req.user.superAdmin)
        return res.json({msg: "This admin is not allowed to add a city from this province."})
        await Cities.create({ ...req.body})
        res.json({ msg: "CITY ADDED" })
    } catch (error) {
        console.error(error)
    }
});

router.post("/deleteByName", async (req, res) => {
    try {
        const city = await Cities.findOne({ name: req.body.name })
        if (!city) return res.json({ msg: "CITY NOT FOUND" })
        if(city.province!=req.user.province && !req.user.superAdmin)
        return res.json({msg: "This admin is not allowed to delete a city from this province."})
        await Cities.deleteOne({ name: req.body.name})
        res.json({ msg: "CITY DELETED" })
    } catch (error) {
        console.error(error)
    }
});

module.exports = router