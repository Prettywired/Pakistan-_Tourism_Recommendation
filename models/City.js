const mongoose=require('mongoose');
const Landmarks = require('./Landmark');
const citySchema=new mongoose.Schema({
name: String,
country:String,
province: String,
image: String,
landmark: [{type: mongoose.SchemaTypes.ObjectId, ref:'Landmarks'}] ,
})

const Cities= mongoose.model('Cities', citySchema);
module.exports=Cities;