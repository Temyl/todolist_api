const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = require('../env')
// const jwtsecretkey = process.env.JWT_SECRET_KEY

const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({error: 'Access denied' });
    } 
    try {
        console.log(token);
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        
        req.id = decoded.id;
        console.log(req.id);
        next();
        // console.log('next middleware called');
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'invalid token'});
    }
    // console.log('authenticate middleware reached');
};

module.exports = { authenticate };