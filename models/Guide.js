const mongoose=require('mongoose');
const guideSchema=new mongoose.Schema({
name: String,
city: {type: mongoose.SchemaTypes.ObjectId, ref:'Cities'},
contact: Number,
website:String,
image:String
})

const Guides= mongoose.model('Guides', guideSchema);
module.exports=Guides;