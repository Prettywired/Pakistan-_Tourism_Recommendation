const mongoose=require('mongoose');
const HotelSchema=new mongoose.Schema({
name: String,
branch: String,
city:String,
contact:Number,
Website: String
})

const Hotels= mongoose.model('Hotels', HotelSchema);
module.exports=Hotels;