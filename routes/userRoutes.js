const express = require("express");
const userRouter = express.Router();




const userController=require("../controllers/user");
const userLogIn=require("../controllers/user");
const { isUser, auth } = require("../middlewares/auther");

userRouter.post("/CreateUser", userController.signUp);

userRouter.post("/userLogIn",userLogIn.UserlogIn);

userRouter.get("/user", auth, isUser, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route of the user",
    });
});

module.exports = userRouter;
