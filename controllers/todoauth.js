// const todolist = require('../db_query/todo');
const pool = require('../db_conn'); 
// require('dotenv').config()


// console.log(process.env.DB_PASSWORD);

const getalltodo = async (req, res) => {
    try {
        // const { id } = req.params;
        const userinfo_id = req.id;
        const todos = await pool.query('SELECT * FROM todo where userinfo_id = $1', [userinfo_id]);
        // const todos = await todolist.fetchtodobyuserinfo(userinfo_id);
        res.status(200).json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

const createtodo = async (req, res) => {
    const { title, description, datelist } = req.body;
    try {
        if (!req.id) {
            return res.status(400).json({ message: 'User not authenticated' });
        }
        const userinfo_id = req.id;
        const todos = await pool.query('INSERT INTO todo (userinfo_id, title, description, datelist) VALUES ($1, $2, $3, $4) RETURNING *', 
        [userinfo_id, title, description, datelist]);
        res.status(201).json('created todo');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'server error' });
    }
};

// const createtodo = async (req, res) => {
//     const { title, description, datelist } = req.body;
//     try {
//         console.log(req.id)
//         const userinfo_id = req.id.id;
//         const todos = await pool.query('INSERT INTO todo ( userinfo_id, title, description, datelist) VALUES ($1, $2, $3, $4) RETURNING *',
//         [userinfo_id, title, description, datelist]);
//         res.status(201).json('created todo')
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'server error'});
//     }
//     // console.log('route handler reached');
// };

const deletetodo = async (req, res) => {
    const { title, description, datelist } = req.body;
    try {
        const userinfo_id = req.id
        const todo = await pool.query('SELECT * FROM todo where userinfo_id = $1', [userinfo_id]);
        const Todo = todo[0];
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        const deletequery = await pool.quert('DELETE FROM todo where id = $1 AND userinfo_id = $2', [id, userinfo_id]);
        res.status(200).json({ message: 'Todo deleted successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error'});
    }
};

const edittodo = async (req, res) => {
    try {
    const { id } = req.params;
    const { title, description, datelist } = req.body;
    const userinfo_id = req.id;
    const { rows: todo} = await pool.query('SELECT * FROM todo WHERE title =$3, description =$2 userinfo_id = $1', 
    [userinfo_id, title, description]);
    const todos = todo[0];
    if (!todo) {
        return res.status(404).json({ message: 'Todo not found'});
        
    }
    const updatequery = await pool.query('UPDATE todo SET title = $1, description = $2', [title, description]);
    res.status(200).json({ message: 'Todo updated successfully'}); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error'});
    }
};



module.exports = { createtodo, getalltodo, deletetodo, edittodo };