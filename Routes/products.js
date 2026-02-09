const express = require('express');
const router = express.Router();
const {read,list,create,update,remove,}= require('../Controllers/Con_products');
const { auth } = require('../Middleware/auth.js');


//http://localhost:5000/api/products

router.get('/products',auth,list);
router.get('/products/:id', auth, read);
router.post('/products',auth,create);
router.put('/products/:id',auth,update);
router.delete('/products/:id',auth,remove);


module.exports = router;