const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
    Income_ID:{type:String}, //รหัสรายรับ
    Income_Source:{type:String}, //ช่องทางที่ได้รับ
    Amount:{type:Number},
    InAmount:{type:Number, default: 0}, //จำนวนเงินที่รับ
},{ timestamps: true });

module.exports = mongoose.model('savings',savingsSchema);