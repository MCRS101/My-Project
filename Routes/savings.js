const express = require('express');
const router = express.Router();
const {read,list,create,update,remove,}= require('../Controllers/Con_savings.js');
const { auth } = require('../Middleware/auth.js');


//http://localhost:5000/api/savings

router.post('/savings',create);
router.get('/savings/:id',list);
router.put("/savings/add/:goalId",update)
router.delete("/savings/remove/:goalId",remove)

module.exports = router;