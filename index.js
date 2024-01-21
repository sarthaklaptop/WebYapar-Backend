const express=require("express");
const fileUPload = require("express-fileupload")
const cors = require("cors")
const app=express();


require("dotenv").config();
const PORT=process.env.PORT || 4000;

app.use(cors({
    origin: 'http://localhost:5500',
    credentials: true,
}));
// app.use(cors())

const cookieParser=require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use(fileUPload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))



const adminRouter=require("./routes/adminRoutes");
const userRouter=require("./routes/userRoutes");
const router=require("./routes/fileUpload");

app.use("/admin",adminRouter);
app.use("/user",userRouter);
app.use("/image",router);


//cloud se connect 
const cloudinary=require("./configs/cloudinary");
cloudinary.cloudinaryConnect();


const dbconnect=require("./configs/database");
dbconnect();


app.listen(PORT,()=>{
    console.log(`App is running successfully on Port no ${PORT}`);
})
