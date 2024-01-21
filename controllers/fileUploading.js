//import the model here
const File=require("../models/File");
const user=require("../models/userModel")
// const { options } = require("../routes/FileUpload");
const cloudinary=require("cloudinary").v2;
//localfileupload handler function




//write function for file format support 
function isFileTypeSupported(type, supportedTypes){
    return supportedTypes.includes(type);
}

//write function for image upload to cloudinary 
async function uploadFileToCloudinary(file, folder,quality){
    const options={folder};
    if(quality){
        options.quality=quality;
    }
    options.resource_type="auto";
    
    return await cloudinary.uploader.upload(file.tempFilePath, options)
}

// // Perform cropping using sharp
// const croppedBuffer = sharp(file.tempFilePath)
// .resize({ width: 300, height: 300, fit: sharp.fit.cover }) // Adjust dimensions as needed
// .toBuffer();

// // Upload the cropped image to Cloudinaryy
// return cloudinary.uploader.upload_stream(
// { ...options, public_id: "cropped-image" },
// (error, result) => {
//   if (error) {
//     throw new Error(error.message);
//   }
//   console.log(result);
// }
// ).end(croppedBuffer);





//imageReducer handler

exports.imageReducer=async (req,res)=>{
    try {
        //fetch all the data
        console.log('inside image reducer route')
        const{name}=req.body;
        const file=req.files.reducedImage;
        console.log("name",name)
        console.log("file => ", file);

        //validating all the data
        //file format supported or not 
        const supportedTypes=["jpg","jpeg","png"];
        const fileType=file.name.split(".")[1].toLowerCase();
        console.log("filetypa",fileType);

        if(!isFileTypeSupported(fileType,supportedTypes,30)){
            res.status(400).json({
                success:false,
                message:"file format is not supported",
            })
        }

        //file format match then upload it to cloudinary
        const response=await uploadFileToCloudinary(file, "Akash");
        // console.log(response);

        //save entry to database
        console.log("req.user",req.User._id)
        const fileData=await File.create({
            name,
            photo:response.secure_url,
            // user:req.User,
            user: req.User._id,
        })
        console.log("file ka data",fileData);

        // Update user's files array
        if (req.User._id) {
            await user.findByIdAndUpdate(req.User._id, { $push: { files: fileData._id } });
            console.log("id updated successfullly")
        } else {
            console.error("User ID not found in the request.");
        }


        // const updatedPost=await user.findByIdAndUpdate(user, {$push:{comments:savedComment._id}},{new:true})
        //                     .populate("comments").exec();
        // Update user's files array
        // if (req.User && req.User._id) {
        //     await user.findByIdAndUpdate(req.User._id, { $push: { files: fileData._id } });
        // } else {
        //     console.error("User ID not found in the request.");
        // }
        res.status(200).json({
            success:true,
            message:"Reduced image is uploaded successfully",
            data:fileData
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"something went wrong",
        })
    }
}


exports.fetchImage=async(req,res)=>{
    try {
        console.log("inside fetching image")
        const {id} =req.params;
        console.log("id", id)

        const response=await File.findById({_id : id});

        console.log("rsData o->", response)

        res.status(200).json({
            success: true,
            message: "imagge fetched sucessfully",
            data : response
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "error while upolading iamge"
        })
        
    }
}