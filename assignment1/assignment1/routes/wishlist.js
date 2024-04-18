const Users = require("../models/User");
const Landmarks = require("../models/Landmark");
const Cities=require("../models/City");
const Activities=require("../models/Activities");
const Restaurants=require("../models/Restaurants");
const Hotels=require("../models/Hotel");
const Guides=require("../models/Guide");
const Wishlists = require("../models/Wishlist");


var express = require("express");
var router = express.Router();

router.post("/getWishlist", async (req, res) => {
    try {
        const { email } = req.body;

        // Retrieve the wishlist for the specified user
        const wishlist = await Wishlists.findOne({ user: email }).populate('city landmark activity restaurant hotel guide');
        if (!wishlist) {
            return res.status(400).json({
                status: "error",
                message: "wishlist not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "wishlist successfully retrieved",
            data: wishlist
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(400).json({
            status: "error",
            message: "error retrieving wishlist"
        });
    }
});


/*router.post("/deleteCityFromWishlist", async (req, res) => {
    try {
        const { token, city } = req.body;

        // Verify JWT token to get user email
        const decoded = jwt.verify(token, "YOUR_SECRET_KEY"); // Replace YOUR_SECRET_KEY with your JWT secret key
        const userEmail = decoded.email;

        // Find the wishlist for the user
        const wishlist = await Wishlists.findOne({ email: userEmail });

        if (!wishlist) {
            return res.status(400).json({
                status: "error",
                message: "wishlist not found"
            });
        }

        // Remove city from the wishlist
        wishlist.city = undefined; // Assuming city is stored as a single field in the wishlist
        await wishlist.save();

        res.status(200).json({
            status: "success",
            message: "city deleted from wishlist"
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(400).json({
            status: "error",
            message: "error deleting city from wishlist"
        });
    }
}); */

router.post("/addToWishlist", async (req, res) => {
    try {
        const { email, type, itemName } = req.body;
        const user = await Users.findOne({ email });
        
        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "User not found"
            });
        }

        let model;
        switch (type) {
            case "city":
                model = Cities;
                break;
            case "activity":
                model = Activities;
                break;
            case "restaurant":
                model = Restaurants;
                break;
            case "hotel":
                model = Hotels;
                break;
            case "guide":
                model = Guides;
                break;
            case "landmark":
                model = Landmarks;
                break;
            default:
                return res.status(400).json({
                    status: "error",
                    message: "Invalid wishlist type"
                });
        }

        
        let item;
        switch (type) {
            case "city":
                item = await model.findOne({ name: itemName });
                break;
            case "activity":
                item = await model.findOne({ type: itemName });
                break;
            case "restaurant":
                item = await model.findOne({ name: itemName });
                break;
            case "hotel":
                item = await model.findOne({ branch: itemName });
                break;
            case "guide":
                item = await model.findOne({ name: itemName });
                break;
            case "landmark":
                item = await model.findOne({ name: itemName });
                break;
            default:
                return res.status(400).json({
                    status: "error",
                    message: "Invalid wishlist type"
                });
        }
        
        if (!item) {
            return res.status(400).json({
                status: "error",
                message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found`
            });
        }

        let existingWishlistItem;
        switch (type) {
            case "city":
                existingWishlistItem = await Wishlists.findOne({
                    user: user.email,
                    [type]: { $in: [item] }
                });       
                break;
            case "activity":
                existingWishlistItem = await Wishlists.findOne({
                    user: user.email,
                    [type]: { $in: [item] }
                });
        
                break;
            case "restaurant":
                existingWishlistItem = await Wishlists.findOne({
                    user: user.email,
                    [type]: { $in: [item] }
                });
                break;        
            case "hotel":
                existingWishlistItem = await Wishlists.findOne({
                    user: user.email,
                    [type]: { $in: [item] }
                });        
                break;
            case "guide":
                existingWishlistItem = await Wishlists.findOne({
                    user: user.email,
                    [type]: { $in: [item] }
                });        
                break;
            case "landmark":
                existingWishlistItem = await Wishlists.findOne({
                    user: user.email,
                    [type]: { $in: [item] }
                });        
                break;
            default:
                return res.status(400).json({
                    status: "error",
                    message: "Invalid wishlist type"
                });
        }

        if (existingWishlistItem) {
            return res.status(400).json({
                status: "error",
                message: `${type.charAt(0).toUpperCase() + type.slice(1)} already exists in user's wishlist`
            });
        }

        let update;
        switch (type) {
            case "city":
                update = { $push: { [type]: item} };
                break;
            case "activity":
                update = { $push: { [type]: item } };
                break;
            case "restaurant":
                update = { $push: { [type]: item } };
                break;
            case "hotel":
                update = { $push: { [type]: item } };
                break;
            case "guide":
                update = { $push: { [type]: item } };
                break;
            case "landmark":
                update = { $push: { [type]: item } };
                break;
            default:
                return res.status(400).json({
                    status: "error",
                    message: "Invalid wishlist type"
                });
        }
        await Wishlists.findOneAndUpdate({ user: user.email }, update, { upsert: true });

        res.status(200).json({
            status: "success",
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} added to wishlist`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Server error"
        });
    }
});

router.post("/deleteFromWishlist", async (req, res) => {
    try {
        const { email, type, itemName } = req.body;
        const user = await Users.findOne({ email });
        
        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "User not found"
            });
        }

        let model;
        switch (type) {
            case "city":
                model = Cities;
                break;
            case "activity":
                model = Activities;
                break;
            case "restaurant":
                model = Restaurants;
                break;
            case "hotel":
                model = Hotels;
                break;
            case "guide":
                model = Guides;
                break;
            case "landmark":
                model = Landmarks;
                break;
            default:
                return res.status(400).json({
                    status: "error",
                    message: "Invalid wishlist type"
                });
        }

        
        let item;
        switch (type) {
            case "city":
                item = await model.findOne({ name: itemName }).select('_id');
                break;
            case "activity":
                item = await model.findOne({ type: itemName }).select('_id');
                break;
            case "restaurant":
                item = await model.findOne({ name: itemName }).select('_id');
                break;
            case "hotel":
                item = await model.findOne({ branch: itemName }).select('_id');
                break;
            case "guide":
                item = await model.findOne({ name: itemName }).select('_id');
                break;
            case "landmark":
                item = await model.findOne({ name: itemName }).select('_id');
                break;
            default:
                return res.status(400).json({
                    status: "error",
                    message: "Invalid wishlist type"
                });
        }
        
        if (!item) {
            return res.status(400).json({
                status: "error",
                message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found`
            });
        }

        let existingWishlistItem;
        switch (type) {
            case "city":
                existingWishlistItem = await Wishlists.findOne({
                    user: user.email,
                    [type]: { $in: [item] }
                });       
                break;
            case "activity":
                existingWishlistItem = await Wishlists.findOne({
                    user: user.email,
                    [type]: { $in: [item] }
                });
        
                break;
            case "restaurant":
                existingWishlistItem = await Wishlists.findOne({
                    user: user.email,
                    [type]: { $in: [item] }
                });
                break;        
            case "hotel":
                existingWishlistItem = await Wishlists.findOne({
                    user: user.email,
                    [type]: { $in: [item] }
                });        
                break;
            case "guide":
                existingWishlistItem = await Wishlists.findOne({
                    user: user.email,
                    [type]: { $in: [item] }
                });        
                break;
            case "landmark":
                existingWishlistItem = await Wishlists.findOne({
                    user: user.email,
                    [type]: { $in: [item] }
                });        
                break;
            default:
                return res.status(400).json({
                    status: "error",
                    message: "Invalid wishlist type"
                });
        }

        if (!existingWishlistItem) {
            return res.status(400).json({
                status: "error",
                message: `${type.charAt(0).toUpperCase() + type.slice(1)} does not exist in user's wishlist`
            });
        }

        const update = { $pull: { [type]: {$in: [item]} } };
        await Wishlists.findOneAndUpdate({ user: user.email }, update);

        res.status(200).json({
            status: "success",
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted from wishlist`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Server error"
        });
    }
});





module.exports = router;
