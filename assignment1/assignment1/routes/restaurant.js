const Users = require("../models/User");
const Restaurants = require("../models/Restaurants");
const Cities=require("../models/City");
var express = require("express");
var router = express.Router();

router.get("/getAll", async (req,res)=>{
    try{
        const restaurants = await Restaurants.find()
        if(restaurants.length===0) return res.json({msg: "NO RESTAURANTS FOUND"})
        res.json({msg:"RESTAURANTS FOUND", data:restaurants })
    }
    catch(error){
        console.error(error);
    }
})
router.post("/getByRestaurantName", async(req,res)=>{
    try{
        const restaurant = await Restaurants.findOne({name: req.body.name})
        if(!restaurant) return res.json({msg: "RESTAURANT NOT FOUND"})
        res.json({msg: "RESTAURANT FOUND", data : restaurant})
    }
    catch(error){
        console.error(error);
    }
})
router.post("/getByCuisine",async (req,res)=>{
    try{
        const cuisine = await Restaurants.findOne({ cuisine: req.body.cuisine });
        if (!cuisine) {
            return res.json({ msg: "CUISINE DOES NOT EXIST" });
        }
        const restaurant = await Restaurants.find({cuisine: req.body.cuisine})
        if(restaurant.length===0) return res.json({msg: "NO RESTAURANTS WITH THIS CUISINE FOUND"})
        res.json({msg: "RESTAURANTS WITH THIS CUISINE FOUND", data:restaurant}) 
    }
    catch(error){
        console.error(error);
    }
    
})

router.post("/getByCityName",async (req,res)=>{
try{
    const cities = await Cities.findOne({name : req.body.name})
    const restaurant = await Restaurants.find({city: cities})
    if(!cities) return res.json({msg : "CITY DOES NOT EXIST"})
    if(restaurant.length===0) return res.json({msg: "NO RESTAURANTS FOUND"})
    res.json({msg : "RESTAURANTS FOUND", data:restaurant})
}
catch(error){
    console.error(error);
}
})
router.post("/getByCityandCuisine",async (req,res)=>{
    try{
        const cities = await Cities.findOne({name: req.body.city})
        if(!cities) return res.json({msg: "CITY NOT FOUND"})
        const cuisine = await Restaurants.findOne({ cuisine: req.body.cuisine });
        if (!cuisine) {
            return res.json({ msg: "CUISINE DOES NOT EXIST" });
        }
        const restaurants = await Restaurants.find({city:cities, cuisine: req.body.cuisine})

        if(restaurants.length===0) return res.json({msg:"NO RESTAURANTS FOUND"})
        res.json({msg: "RESTAURANTS FOUND", data:restaurants})
    }
    catch(error){
        console.error(error);
    }
})

router.use((req, res, next) => {
    if (!req.user.admin) return res.json({ msg: "NOT ADMIN" })
    else next()
})

router.put("/addRestaurant", async (req,res)=>{
    try{
        const city = await Cities.findOne({name: req.body.city})
        const restaurant = await Restaurants.findOne({name: req.body.name})
        if(restaurant) return res.json({msg: "RESTAURANT EXISTS"})
        if (!city) return res.json({ msg: "CITY NOT FOUND" })
        let checkRestaurant = /^[a-zA-Z\s]+$/
    if(!checkRestaurant.test(req.body.name)){
        return res.json({msg: "Restaurant name needs to be valid"})
    }
    if(city.province !== req.user.province&&req.user.superAdmin===false)
    return res.json({msg: "This admin is not allowed to add a Restaurant to this city in this province."})
        await Restaurants.create({ ...req.body, city: city._id })
        res.json({ msg: "RESTAURANT ADDED" })
    } catch (error) {
        console.error(error)
    }
    })
    router.delete("/deleteByName", async (req, res) => {
        try {
            const restaurant = await Restaurants.findOne({ name: req.body.name });
            if (!restaurant) return res.json({ msg: "RESTAURANT NOT FOUND" });
    
            const city = await Cities.findOne({ _id: restaurant.city });
            if (!city) return res.json({ msg: "CITY NOT FOUND" });
    
            if (city.province !== req.user.province&&req.user.superAdmin===false) {
                return res.json({ msg: "This admin is not allowed to delete a restaurant from this city in this province." });
            }
    
            await Restaurants.deleteOne({ name: req.body.name });
            res.json({ msg: "RESTAURANT DELETED" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Internal server error" });
        }
    });

module.exports = router