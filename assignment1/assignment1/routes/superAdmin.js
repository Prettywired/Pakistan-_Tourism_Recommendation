const bcrypt = require("bcrypt");
const Users = require("../models/User");
var express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");


router.use(async (req, res, next) => {
    if (!req.user.superAdmin) res.json({ msg: "NOT SUPERADMIN" })
    else next()


}
)
router.post("/registerAdmin", async (req, res) => {
    try {
        let checkEmail = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/
        if (!checkEmail.test(req.body.email)) {
            return res.json({ msg: "Invalid Email, please try again" })
        }
        let checkPassword = /^[a-zA-Z0-9]{8,}$/ //regex for password that include characters other than letters and digits
        if (!checkPassword.test(req.body.password)) { return res.json({ msg: "Password needs to be at least 8 characters long and only consist of letters and digits." }) }
        let checkName = /^[a-zA-Z]{3,}$/
        if (!checkName.test(req.body.firstname) || !checkName.test(req.body.lastName)) { //checking if name is only alphabets
            return res.json({ msg: "Name too short and cannot contain digits" })
        }
        let user = await Users.findOne({ email: req.body.email })
        if (user) return res.json({ msg: "USER EXISTS" })

        await Users.create({ ...req.body, password: await bcrypt.hash(password, 5) });
        return res.json({ msg: "CREATED" })

    }
    catch (error) {
        console.error(e)
    }

});

router.post("/deleteAdmin", async (req, res) => {
    try {
        let user = Users.findOne({ email: req.body.email })
        if (!user) return res.json({ mag: "ADMIN NOT FOUND" })
        const admin = user.admin;
        if (!admin) return res.json({ msg: "THIS USER IS NOT AN ADMIN" })
        await Users.deleteOne({ email: req.body.email })
        res.json({ msg: "ADMIN DELETED" })
    } catch (error) {
        console.error(error)
    }
}
)
module.exports = router