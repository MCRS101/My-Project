const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    Expense_ID:{type:String}, //รหัสรายจ่าย
    Expense_Name:{type:String}, //รายละเอียดหรือชื่อของรายการที่จ่าย
    Amount:{type:String}, 
    Description:{type:String},//จำนวนเงินจ่าย
    Expense_Date:{type:Date}, //วันที่รายรับ
     tags: {
    need: Boolean,
    variable: Boolean,
  },
},{ timestamps: true });

module.exports = mongoose.model('expense',expenseSchema);