const mongoose=require('mongoose');
const citySchema=new mongoose.Schema({
name: String,
country:String,
province: String
})

const Cities= mongoose.model('Cities', citySchema);
module.exports=Cities;