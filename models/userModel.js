const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],

    
})

module.exports=mongoose.model("user",userSchema);