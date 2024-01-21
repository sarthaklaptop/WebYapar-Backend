const adminModel=require("../models/adminModel");

const jwt=require("jsonwebtoken");

require("dotenv").config();


exports.adminlogIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Enter all details carefully",
            });
        }

        
        const admindetails = {
            email: "admin@gmail.com",
            password: "adminpassword",
        };

        if (email === admindetails.email && password === admindetails.password) {
            const payload = {
                email: admindetails.email,
                
                
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "1h", 
            });

            const updateAdmin = {
                email: admindetails.email,
                token,
            };

            const options = {
                expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 10000),
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production", // Set to true in production
            };

            return res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                // updateAdmin,
                message: "Admin logged in successfully",
            });
        } else {
            return res.status(403).json({
                success: false,
                message: "Invalid credentials",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failure in log in, try again later",
        });
    }
};


