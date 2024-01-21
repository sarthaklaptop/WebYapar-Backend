
const express=require("express");
const router=express.Router();


const {imageReducer, fetchImage}=require("../controllers/fileUploading");
const {auth}=require("../middlewares/auther");
const {markAsDone,markAsDeleted}=require("../controllers/doneDelete")

//map api routes

router.post("/imageReducer", auth,imageReducer);
router.get("/fetchImage/:id",fetchImage)

router.put('/items/:itemId/done', markAsDone);
router.put('/items/:itemId/delete', markAsDeleted);

//exports
module.exports=router;