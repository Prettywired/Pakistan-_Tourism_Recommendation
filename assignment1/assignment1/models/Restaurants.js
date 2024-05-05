const mongoose=require('mongoose');
const restaurantsSchema=new mongoose.Schema({
name: String,
city: {type: mongoose.SchemaTypes.ObjectId, ref:'Cities'},
description:String,
cuisine: String,
contact: Number

})

const Restaurants= mongoose.model('Restaurants', restaurantsSchema);
module.exports=Restaurants;