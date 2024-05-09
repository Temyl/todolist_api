const pool = require('../db_conn')

const fetchuserinfo = async (id) => {
    const query = 'SELECT * FROM userinfo WHERE id = $1';
    try {
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};


// async function fetchUserById(id) {
//     try {
//         const result = await pool.query('SELECT * FROM userinfo WHERE id = $1', [id]);
//         return result.rows;
//     } catch (err) {
//         console.error('Error executing query:', err.stack);
//         return null;
//     }
// }

// // Call function with an example ID
// fetchUserById(1).then(user => {
//     if (user) {
//         console.log('User Found:', user);
//     } else {
//         console.log('No user found or an error occurred.');
//     }
// });

module.exports = fetchuserinfo;