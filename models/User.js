const mongoose=require('mongoose');

const UserSchema =new mongoose.Schema({
email:String,
password: String,
firstName:String,
lastName:String,
superAdmin:{type: Boolean, default:false},
admin:{type: Boolean, default:false},
province:{type:String, enum:["Sindh","Punjab", "Khyber Pakhtunkhwa", "Balochistan"]},
city: {type: mongoose.SchemaTypes.ObjectId, ref:'Cities'},
createdAt:{
    type:Date,
    default: Date.now
},

});
const Users=mongoose.model('Users', UserSchema);
module.exports=Users;