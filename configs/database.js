const mongoose=require("mongoose");

require("dotenv").config();


const dbconnect =()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(()=>{console.log("Database is connected successfully")})
    .catch((error)=>{console.log("Database connection issues",error);
                        process.exit(1);})
}

module.exports=dbconnect;