const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require("../middleware/authenticate");

require('../db/conn');
const User = require("../model/userSchema");

// router.get('/',(req,res)=>{
//     res.send("hello world from server route.js")
// });



router.post('/register', async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: ("plz fill") })
    }
    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "Email already Exist" });
        }
        else if (password != cpassword) {
            return res.status(422).json({ error: "Password are not matching" });
        }
        const user = new User({ name, email, phone, work, password, cpassword });
        const userRegister = await user.save();
        if (userRegister) {
            res.status(201).json({ message: "User registered Successfully" });
        }
        else {
            res.status(500).json({ error: "Failed to register" })
        }
    }
    catch (err) {
        console.log(err);
    }


});

// Login Route
router.post('/signin', async (req, res) => {

    try {
        let token;
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Empty plz fill" })
        }
        const userLogin = await User.findOne({ email: email });
        console.log(userLogin);
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+25892000000),
                httpOnly: true
            });

            if (!isMatch) {
                res.status(400).json({ message: "Invalid Credentials pass" })
            }
            else {
                res.json({ message: "User sign in Successfully" })
            }
        }
        else
        {
            res.status(400).json({ message: "Invalid Credentials" })
        }



    }
    catch (err) {
        console.log(err);
    }
});

// About Us
router.get('/about', authenticate,(req,res)=>{
    // console.log("Hello from About");
    res.send(req.rootUser);
});
// get user data for contact and home page
router.get('/getdata',authenticate,(req,res)=>{
    res.send(req.rootUser);
});

// contact us

router.post('/contact', authenticate, async (req, res) => {
    try {

        const { name, email, phone, message } = req.body;
        
        if (!name || !email || !phone || !message) {
            console.log("error in contact form");
            return res.json({ error: "plzz filled the contact form " });
        }

        const userContact = await User.findOne({ _id: req.userID });

        if (userContact) {
            
            const userMessage = await userContact.addMessage(name, email, phone, message);

            await userContact.save();

            res.status(201).json({ message: "user Contact successfully" });

        }
        
    } catch (error) {
        console.log(error);
    }

});

// Logout
router.get('/logout',(req,res)=>{
    res.clearCookie('jwtoken',{path: '/'});
    res.status(200).send("User Logout");
});

module.exports = router;


