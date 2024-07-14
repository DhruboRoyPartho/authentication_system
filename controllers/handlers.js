const user_db = require('../models/userDB');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const expireTime = 30 * 24 * 60 * 60 * 1000;

async function handleAddNewUser(req, res) {
    const {f_name, l_name, email, password} = req.body;
    if(!(f_name && l_name && email && password)){
        // return res.json({Warning: 'Please fill all the fields'});
        const warning = 'Warning: Please fill all the fields';
        return res.redirect(`/signup?warning=${encodeURIComponent(warning)}`);
    }
    const user = await user_db.findOne({email});
    if(user){
        const warning = 'Warning: Email used before. Please change email.';
        return res.redirect(`/signup?warning=${encodeURIComponent(warning)}`);
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        await user_db.create({
            f_name,
            l_name,
            email,
            password: hashPassword,
        });

        const warning = 'Your account successfully created..';
        return res.redirect(`/signin?warning=${encodeURIComponent(warning)}`);

    } catch (error) {
        console.log('Serverside error..'); 
        if(error) throw error;
        const warning = 'Something wrong. Account not created.';
        return res.redirect(`/signup?warning=${encodeURIComponent(warning)}`);
    }  

    // return res.json({f_name, l_name, email, password});
}

async function handleAuthenticateUser(req, res) {
    const {email, password} = req.body;
    if(!(email && password)) {
        const warning = 'Warning: Please fill all the fields.';
        return res.redirect(`/signin?warning=${encodeURIComponent(warning)}`);
    }
    const user = await user_db.findOne({email});
    if(!user){
        const warning = 'Warning: Email not exists.';
        return res.redirect(`/signin?warning=${encodeURIComponent(warning)}`);
    }

    try {
        const hashPassword = await user.password;
        const isMatch = await bcrypt.compare(password, hashPassword);
        if(isMatch){
            // Matched

            user.password = undefined;

            const token = jwt.sign(
                {user},
                'shhhhh',
                {
                    expiresIn: expireTime
                }
            );

            res.cookie('token', token, {httpOnly: true, secure: false});

            const warning = 'Warning: Successfully logged in.';
            return res.redirect(`/?warning=${encodeURIComponent(warning)}`);
        }
        const warning = 'Warning: Wrong credentials.';
        return res.redirect(`/signin?warning=${encodeURIComponent(warning)}`);
    } catch (error) {
        const warning = 'Warning: Something wrong.';
        return res.redirect(`/signin?warning=${encodeURIComponent(warning)}`);
    }
}

async function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if(!token){
        req.isAuthenticated = false;
        return next();
    }
    jwt.verify(token, 'shhhhh', (err, decoded) => {
        if (err) {
            req.isAuthenticated = false;
            return next();
        }
        req.isAuthenticated = true;
        req.user = decoded;
        next();
    });
}

async function handleLogout(req, res) {
    res.clearCookie('token');
    const warning = 'Looged out.';
    return res.redirect(`/?warning=${encodeURIComponent(warning)}`);
}

module.exports = {
    handleAddNewUser,
    handleAuthenticateUser,
    verifyToken,
    handleLogout,
}