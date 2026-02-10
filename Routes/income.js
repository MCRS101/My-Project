const express = require('express');
const router = express.Router();
const {read,list,create,update,remove,}= require('../Controllers/Con_incomes');
const { auth } = require('../Middleware/auth.js');


//http://localhost:5000/api/income
router.post('/incomes',create);
router.get('/incomes/:id',list);
router.get('/incomereport/:id',read);



module.exports = router;