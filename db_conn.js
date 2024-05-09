const { Pool } = require( 'pg' );
const { DB_USER, DB_HOST, DATABASE, DB_PORT, DB_PASSWORD } = require('./env');



const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT
});
pool.connect(function(err){
    if (err) throw err;
    console.log('connected')
    // console.log(typeof dbpassword)
});
// pool.connect()
//   .then(() => console.log('Connected to PostgreSQL'))
//   .catch(err => console.error('Connection error', err));



module.exports = pool;