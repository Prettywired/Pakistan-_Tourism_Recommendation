/*  hotel model in backend */ const mongoose=require('mongoose');
const HotelSchema=new mongoose.Schema({
    name: String,
    branch: String,
    city:{type: mongoose.SchemaTypes.ObjectId, ref:'Cities'},
    contact:Number,
    Website: String,
    image: String
    })
    
    const Hotels= mongoose.model('Hotels', HotelSchema);
    module.exports=Hotels;