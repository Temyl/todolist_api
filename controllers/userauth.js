const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const pool = require('../db_conn'); 
const { mail_username, JWT_SECRET_KEY } = require('../env');
const nodemailer = require('../nodemailer')
// dotenv.config();
// const secret_key = process.env.JWT_SECRET_KEY;
// const mail_username = process.env.mail_username;

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const old_userdata = await pool.query('SELECT * FROM userinfo WHERE email = $1;', [email]);
        if (old_userdata.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const new_userdata = await pool.query(
                'INSERT INTO userinfo (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
                [username, email, hashedPassword]
            );

            const newUser = new_userdata.rows[0];
            const token = jwt.sign({ id: newUser.id }, JWT_SECRET_KEY, { expiresIn: '1h' });

            return res.status(201).json({
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                token,
                message: 'User registered successfully'
            });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userdata = await pool.query('SELECT * FROM userinfo WHERE email = $1;', [email]);
        if (userdata.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user= userdata.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            token,
            message: 'Logged in successfully'
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
    }
};


// const login = async (req, res) => {
//     const { email, password} =  req.body;
//     try {
//         const old_userdata = await pool.query(`SELECT * FROM userinfo WHERE email= $1;`,[email])
//         const user = old_userdata.rows;
//         if (user.length === 0) {
//             res.status(400).json({
//                 error: 'User is not registered, Sign Up',
//             });
//         } else {
//             bcrypt.compare(password, user[0].password, (err, result) => {
//                 if (err) {
//                     res.status(500).json({ error: 'Server error' });  
//                 } else if (result) {
//                     const token = jwt.sign({ email }, secret_key);
//                     res.status(200).json({ message: 'User signed in!', token });
//                 } else {
//                     res.status(400).json({ error: 'Enter correct password!' });
//                 }
//             });
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: 'Database error occurred while signing in!' });
//     }
// };

const reset_password = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const userdata = await pool.query('SELECT * FROM userinfo WHERE email = $1;', [email]);
        if (userdata.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await pool.query('UPDATE userinfo SET password = $1 WHERE email = $2;', [hashedPassword, email]);

        return res.status(200).json({
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
    }
};


const forgot_password = async (req, res) => {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        const user = await pool.query('SELECT * FROM userinfo WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const token = jwt.sign(
            { email: user.rows[0].email, id: user.rows[0].id },
            JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );
        await nodemailer.transporter.sendMail({
            from: mail_username,
            to: email,
            subject: 'Reset Password',
            text: `Please use the following link to reset your password: https://localhost:3000/user/reset_password?token=${token}`,
            html: `<p>Please use the following link to reset your password: <a href="https://localhost:3000/user/reset_password?token=${token}">Reset Password</a></p>`
        });

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};



module.exports = { register, login, reset_password, forgot_password };