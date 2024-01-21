const mongoose=require("mongoose");
// const nodemailer=require("nodemailer")

require("dotenv").config();

const fileSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    photo:{
        type:String,
        required:true,
    },
    user: 
    { type: mongoose.Schema.Types.ObjectId,
         ref: 'user' 
        
    },
    status: {
        type: String,
        enum: ['pending', 'done', 'deleted'],
        default: 'pending',
    },
});

//Post middleware
//database me save hone ke just bad fileschema me post method me async function
// fileSchema.post("save", async(doc)=>{
//     try {
//         console.log("Docs",doc);

//         //create a transporter
//         let transporter= nodemailer.createTransport({
//             host:process.env.MAIL_HOST,
//             port: 587,
//             secure: false,
//             auth:{
//                 user:process.env.MAIL_USER,
//                 pass:process.env.MAIL_PASS,
//             }
//         })

//         //send mail
//         console.log("sending info")
//         let info=await transporter.sendMail({
//             from:`Codehelp - by Akash`,
//             to:doc.email,
//             subject:"New file uploaded on cloudinary successfully",
//             html:`<h1>Hello Jee</h1>
//                     <p>File Uploaded view here: <a href= "${doc.imageUrl}">${doc.imageUrl}</a></p>`
//         })

//         console.log("info", info);

//     } catch (error) {
//         console.log("Error sending email:", error)
//     }
// })

module.exports=mongoose.model("File",fileSchema);