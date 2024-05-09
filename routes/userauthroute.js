const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/userauthmiddleware')

const { register, 
    login, 
    forgot_password, 
    reset_password 
} = require('../controllers/userauth');


router.post('/register', register);

router.post('/login', login);

router.post('/reset_password' , reset_password);

router.post('/forgot_password' , forgot_password);


module.exports = router;


