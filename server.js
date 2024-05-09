const express = require('express');
const bodyparser = require('body-parser');
const authroutes = require('./routes/userauthroute');
const todoroutes = require('./routes/todoroutes');
// const error_handler =  require('./middleware/errorhandlingMiddle')

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyparser.json());
// app.use(error_handler)

app.use('/user', authroutes);
app.use('/todo', todoroutes);

app.listen(port, () => {
    console.log('server running on port ${port}');
});