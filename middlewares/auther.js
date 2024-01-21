const jwt = require("jsonwebtoken");
const { rawListeners } = require("../models/File");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        // Extracting token from req
        console.log("inside try block")
        console.log("cookie",req.cookies.token)
        // console.log("body", req.body.token);
        // console.log("cookie", req.cookies.token);
        // console.log("header", req.header("Authorization"));
    

        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");
        console.log("token",token);
        // Check if token is empty
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token fetched from req body is empty",
            });
        }

        // Verify the token
        try {
            console.log("inside the try block")
            console.log("token to verify ",token)
            const decode = jwt.verify(token, process.env.JWT_SECRET,{expiresIn:"2h"});
            console.log("decode",decode);


            req.User={
                ...decode,
                _id:decode.id,
            };
            console.log("req ki body",req.User);
            // Attach decoded payload to the request
            // req.User = {
            //     ...decode,
            //     _id: decode.id, // Assuming your user ID is stored in 'id' field of the token payload
            // };
            // console.log("reqkauser",req.User)
            // console.log("akash",req.User);

            // Now, you can access req.User.isAdmin to check if the user is an admin in subsequent middlewares or route handlers
        } catch (error) {
            console.error(error);
            return res.status(402).json({
                success: false,
                message: "Error occurred in verifying token",
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while auth middleware",
        });
    }
};

exports.isAdmin = (req, res, next) => {
    try {
        // Check if the user has the attribute indicating admin status
        if (!req.User || !req.User.isAdmin) {
            console.log("Invalid admin token:", req.User);
            return res.status(401).json({
                success: false,
                message: "This is a protected route only for admins",
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred in the isAdmin middleware",
        });
    }
};


exports.isUser = (req, res, next) => {
    try {
        // Check if the user has the attribute indicating user status
        if (!req.User || req.User.isUser !== false) {
            return res.status(401).json({
                success: false,
                message: "This is a protected route only for users",
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred in the isUser middleware",
        });
    }
};
