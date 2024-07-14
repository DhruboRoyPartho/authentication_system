const express = require('express');
const { verifyToken } = require('../controllers/handlers');

const router = express.Router();

router.get("/", verifyToken, (req, res) => {
    const warning = req.query.warning;
    return res.render('index', {isAuthenticated: req.isAuthenticated, user: req.user, warning});
});

router.get('/signup', (req, res) => {
    // try{
        const warning = req.query.warning;
        return res.render('signup', { warning });
    // } catch (error){
    //     throw error;
    // }
    // return res.render('signup');
});

router.get('/signin', verifyToken, (req, res) => {
    if(req.isAuthenticated){
        return res.redirect('/');
    }
    const warning = req.query.warning;
    return res.render('signin', { warning });
    // return res.render('signin');
});

module.exports = router;