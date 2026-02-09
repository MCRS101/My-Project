const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    Income_ID:{type:String}, //รหัสรายรับ
    Income_Source:{type:String}, //ช่องทางที่ได้รับ
    Description:{type:String}, //ได้รับจากอะไร
    Amount:{type:String}, //จำนวนเงินที่รับ
    Income_Date:{type:String}, //วันที่รายรับ
},{ timestamps: true });

module.exports = mongoose.model('income',incomeSchema);