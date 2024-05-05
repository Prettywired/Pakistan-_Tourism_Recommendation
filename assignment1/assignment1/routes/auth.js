const bcrypt = require("bcrypt");
const Users = require("../models/User");
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const Cities = require("../models/City");
const Wishlist = require("../models/Wishlist");

router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body
        let checkEmail = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/
        if (!checkEmail.test(email)) {
            return res.json({ msg: "Invalid Email, please try again" })
        }
        let checkPassword = /^[a-zA-Z0-9]{8,}$/ //regex for password that include characters other than letters and digits
        if (!checkPassword.test(password)) { return res.json({ msg: "Password needs to be at least 8 characters long and only consist of letters and digits." }) }
        let checkName = /^[a-zA-Z]{3,}$/
        if (!checkName.test(req.body.firstname) || !checkName.test(req.body.lastName)) { //checking if name is only alphabets
            return res.json({ msg: "Name too short and cannot contain digits" })
        }
        let user = await Users.findOne({ email })
        if (user) return res.json({ msg: "USER EXISTS" })
        const cities = await Cities.findOne({ name: req.body.city })
        if (!cities) return res.json({ msg: "USER'S CITY NOT FOUND" })
        await Users.create({ ...req.body, password: await bcrypt.hash(password, 5), city: cities, admin: false, superAdmin: false });
        await Wishlist.create({user:email});
        return res.json({ msg: "CREATED" })

    }
    catch (error) {
        console.error(error)
    }

});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await Users.findOne({ email })
        if (!user) return res.json({ msg: "USER NOT FOUND" })

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) return res.json({ msg: "WRONG PASSWORD" })

        const token = jwt.sign({
            superadmin: user.superAdmin,
            province: user.province,
            email,
            createdAt: new Date(),
            admin: user.admin,
        }, "SECRET", { expiresIn: "1d" });

        res.json({
            msg: "LOGGED IN", token
        })
    } catch (error) {
        console.error(error)
    }
});

module.exports = router
