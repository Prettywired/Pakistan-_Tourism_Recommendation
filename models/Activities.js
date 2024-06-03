/* backend Activities.js */ const mongoose=require('mongoose');
const activitySchema=new mongoose.Schema({
    type: String,
    description: String,
    image: String
    })
    
    const Activities= mongoose.model('Activities', activitySchema);
    module.exports=Activities;