const express = require('express');
const router = express.Router();
const {read,list,create,update,remove,}= require('../Controllers/Con_expense');
const { auth } = require('../Middleware/auth.js');


//http://localhost:5000/api/expense
router.post('/expense',create);
router.get('/expense/:id',list);
router.get('/expensereport/:id',read);


module.exports = router;