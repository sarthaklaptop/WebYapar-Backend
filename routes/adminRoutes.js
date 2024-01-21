const express = require("express");
const { model } = require("mongoose");
const  user=require("../models/userModel")
const adminRouter = express.Router();

const { adminlogIn } = require("../controllers/adminAuth");
const { auth, isAdmin } = require("../middlewares/auther");

adminRouter.post("/logIn", adminlogIn,auth,isAdmin);

// adminRouter.post("/")

adminRouter.post("/fetchUserData", async (req, res) => {
    try {
        const { userId } = req.body;

        const userData = await user.findOne({userName:userId}).populate('files'); // Use populate to fetch associated files

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            userData,
            message: "User data fetched successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching user data",
        });
    }
});


// adminRouter.get("/fetchUserData/:id", auth, async(req, res)=>{
//     try {
//         const id=req.params.id;
//         console.log("id",id);

//         const User=await user.findById(id);

//         res.status(200).json({
//             success: true,
//             userData:User,
//             message: "User data fetched successfully",
//         });

//     } catch (error) {
//         res.status(500).json({
//             error:error,
//             success:false,
//             message:"failed to reach in email route"
//         })
//     }
// })





module.exports = adminRouter;
