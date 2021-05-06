const express = require('express');
const router = express.Router();
const userService = require('./../services/userService')

router.post('/login', (req, res) => {
    var result = userService.getAllUsers();
    result.then( res => console.log(res) );
    res.status(200).json({status: 200, logged:true});
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({status: 200, logged:false});
});

router.post('/signup', (req, res) => {
    res.sendStatus(200);
});

module.exports = router;