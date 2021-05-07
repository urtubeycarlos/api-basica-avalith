const express = require('express');
const router = express.Router();
const md5 = require('md5');
const db = require('./../db');

router.post('/login', (request, response) => {
    if (!request.fields.email || !request.fields.password)
        response.status(400).json({status:400, logged:false, msg:'invalid body'});
    db.query('select * from user where email = ?', request.fields.email, (error, result) => {
        if( error )
            response.sendStatus(500);
        else {
            if( result[0].email == request.fields.email && result[0].password == md5(request.fields.password) ){
                request.session.user = request.fields.email;
                response.status(200).json({status:200, logged:true});
            } else
                response.status(400).json({status:400, logged:false});
        }
    });
});

router.post('/logout', (request, response) => {
    request.session.destroy();
    response.status(200).json({status: 200, logged:false});
});

router.post('/signup', (request, response) => {
    if( !request.fields.email || !request.fields.password )
        response.status(400).json({status:400, signup:false, msg:'invalid body'});
    db.query ('insert into user (email, password) select ?, MD5(?) from dual where not exists ( select * from user where email = ? )', [request.fields.email, request.fields.password, request.fields.email], (error, result) => {
        if( error )
            response.sendStatus(500);
        else {
            if( result.affectedRows == 0 )
                response.status(400).json({status:400, signup:false, msg:'user already exists'});
            else
                response.status(200).json({status:200, signup:true, msg:'user added successfully'});
        }
    });
});

router.put('/changepassword', (request, response) => {
    if( !request.fields.email || !request.fields.password || !request.fields.newPassword )
        response.status(400).json({status:400, password_changed:false, msg:'invalid body'});
    db.query('update user set password = MD5(?) where email = ? and password = MD5(?)', [request.fields.newPassword, request.fields.email, request.fields.password], (error, result) => {
        if( error )
            response.sendStatus(500);
        else {
            if( result.affectedRows == 0 )
                response.status(400).json({status:400, password_changed:false, msg:'invalidad email or password'});
            else
                response.status(200).json({status:200, password_changed:true, msg:'password changed'});
        }
    });
});

router.delete('/signdown', (request, response) => {
    if( !request.fields.email || !request.fields.password)
        response.status(400).json({status:400, signdown:false, msg:'invalid body'});
    db.query('delete from user where email = ? and password = MD5(?)', [request.fields.email, request.fields.password], (error, result) => {
        if( error )
            response.sendStatus(500);
        else {
            if( result.affectedRows == 0 )
                response.status(400).json({status:400, signdown:false, msg:'invalidad email or password'});
            else
                response.status(200).json({status:200, signdown:false, msg:'user eliminated succesfully'});
        }
    });
});


module.exports = router;