const pool = require('../db_conn')

const fetchtodobyuserinfo = async (userinfo_id) => {
    const query = 'SELECT * FROM todo WHERE userinfo_id = $1';
    try {
        const { rows } = await pool.query(query, [userinfo_id]);
        return rows;
    } catch (error) {
        console.error('Error fetching todo info:', error);
        throw error;
    }
};

module.exports = { fetchtodobyuserinfo }
