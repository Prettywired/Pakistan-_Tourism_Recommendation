const mongoose=require('mongoose');
const transportSchema=new mongoose.Schema({
    type: String,
company: String,
contact: String,
image: String,
city:{type: mongoose.SchemaTypes.ObjectId, ref:'Cities'}
})

const Transports= mongoose.model('Transport', transportSchema);
module.exports=Transports;