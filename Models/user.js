const momgpose = require('mongoose');
const userSchema = momgpose.Schema({
    name:{type:String, required:true},
    password:{type:String, required:true},
    email:{type:String, required:true},
    phone:{type:String, required:true},
},{timestamps: true});

module.exports = momgpose.model('users', userSchema);