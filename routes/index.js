const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")

const authRouter = require("./auth");
const cityRouter = require("./city");
const landmarkRouter=require("./landmark");
const profileRouter=require("./profile");
const activityRouter = require("./activities");
const hotelRouter = require("./hotel");
const superAdminRouter = require("./superAdmin");
const restaurantRouter = require("./restaurant");
const transportRouter = require("./transport");
const wishlistRouter = require("./wishlist");
const guideRouter= require("./guide")

router.use("/auth", authRouter); //authentication doesnt need jwt hence before that middleware



router.use(async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const user = jwt.verify(token.split(" ")[1], "SECRET")
        req.user = user;
        next()
    } catch (e) {
        return res.json({ msg: "TOKEN NOT FOUND/ INVALID"})
    }
})

router.use("/profile", profileRouter);
router.use("/landmark", landmarkRouter);
router.use("/city", cityRouter);
router.use("/activity", activityRouter);
router.use("/hotel", hotelRouter);
router.use("/restaurant", restaurantRouter);
router.use("/transport", transportRouter);
router.use("/superAdmin", superAdminRouter);
router.use("/wishlist", wishlistRouter);
router.use("/guide", guideRouter);
module.exports = router;