const express = require('express');
const router = express.Router();
const { register, login,id  } = require ('../Controllers/auth.js');
const { auth } = require('../Middleware/auth.js');


router.get('/id/:id', id);
router.post('/register', register);
router.post('/login', login);


module.exports = router;