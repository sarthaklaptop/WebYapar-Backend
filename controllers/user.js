const user=require("../models/userModel");
const bcrypt=require("bcrypt");
const { response } = require("express");
const jwt = require("jsonwebtoken")
// const jwt=require("jsonwebtoken");

require("dotenv").config();

exports.signUp=async(req,res)=>{
    try {
        //get data
        const {userName, password}=req.body;

        const existingData=await user.findOne({userName});

        if(existingData){
            return res.status(400).json({
                success:false,
                message:"User already exits",
            })
        }

        //secure the password
        let hashedPassword
        try {
            hashedPassword=await bcrypt.hash(password, 10);

            
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success:false,
                message:"error is occured in hashing the password"
            })
        }

        //create the entry of user in the database
        const users=await user.create({
            userName, password:hashedPassword
        });

        return res.status(200).json({
            user:users,
            success:true,
            message:"User created successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"user cannot be created please try again latter"
        })
    }
};

exports.UserlogIn = async (req, res) => {
    try {
        // Fetching data
        const { userName, password } = req.body;
        console.log("userloginfunction")
        // Check whether username or password is present or not
        if (!userName || !password) {
            res.status(400).json({
                success: false,
                message: "Enter all details carefully",
            });
        }

        // Finding user from the database based on username
        const User = await user.findOne({userName});
        console.log("userinfo",User);


        // Checking whether user is registered or not
        if (!User) {
            return res.status(401).json({
                success: false,
                message: "User is not registered",
            });
        }


        const payload={
            userName:User.userName,
            id:User._id,
            // role:User.role
        }
        console.log(payload)
        // Compare password directly without checking for a role or payload
        if (await bcrypt.compare(password, User.password)) {
            // Password match
            // Create JWT token
            const token = jwt.sign(
                // { username: User.userName, id: user._id },
                payload,
                process.env.JWT_SECRET,
                { expiresIn: "20h" }
            );
                // console.log("let token",token)
            // Pass token in the user object
            const updateUser = {
                ...User.toObject(),
                token: token,
            };
            // console.log("updated User",updateUser)
            updateUser.password = undefined;

            // Create cookie and send a response
            const options = {
                expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 10000),
                httpOnly: true,
                // secure: true, // Set to true if served over HTTPS
                sameSite: 'None',
            };

            console.log("inside user.js")
            console.log("token",token)
            // console.log("cookie",cookie)
            return res.cookie("token", token, options).status(200).json({
               
                success: true,
                token,
                updateUser,
                message: "User logged in successfully",
            });
            // console.log("res",token);
        } else {
            res.status(403).json({
                success: false,
                message: "Password does not match",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failure in login, try again later",
        });
    }
};
