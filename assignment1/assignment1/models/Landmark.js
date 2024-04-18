const mongoose=require("mongoose");

const landmarkSchema=new mongoose.Schema({

name: String,
description:String,
type:String,
city: {type: mongoose.SchemaTypes.ObjectId, ref:'Cities'},
website: String,
contact: Number
})

const Landmarks =mongoose.model('Landmarks', landmarkSchema);
module.exports=Landmarks;