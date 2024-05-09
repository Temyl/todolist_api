const express = require('express');
const router = express.Router();
const Authenticate = require('../middleware/authmiddleware')

const { createtodo, 
    getalltodo, 
    deletetodo, 
    edittodo } = require('../controllers/todoauth')

router.use(Authenticate.authenticate);   
router.get('/', Authenticate.authenticate, getalltodo);
router.post('/todos', Authenticate.authenticate, createtodo);
router.delete('/todos/:id', Authenticate.authenticate, deletetodo);
router.put('/todos/:id', Authenticate.authenticate, edittodo)



module.exports = router;