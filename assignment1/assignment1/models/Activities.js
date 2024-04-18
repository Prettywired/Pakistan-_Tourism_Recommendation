const mongoose=require('mongoose');
const activitySchema=new mongoose.Schema({
type: String,
description: String,
landmark: {type: mongoose.SchemaTypes.ObjectId, ref:'Landmarks'},
city: {type: mongoose.SchemaTypes.ObjectId, ref:'Cities'},
})

const Activities= mongoose.model('Activities', activitySchema);
module.exports=Activities;