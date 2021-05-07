const { request } = require('express');
const express = require('express');
const router = express.Router();
const db = require('./../db');

router.get('/', (request, response) => {
    db.query('select * from career', (error, results) => {
        if( error )
            response.sendStatus(500);
        else
            response.status(200).json(results);
    });
});

router.get('/:id', (request, response) => {
    db.query('select * from career where id = ?', request.params.id, (error, result) => {
        if( error )
            response.sendStatus(500);
        else
            response.status(200).json(result);
    });
});

router.post('/', (request, response) => {
    if( !request.fields.name || !request.fields.institute )
        response.status(400).json({status:400, added:false, msg:'invalid body'});
    else {
        db.query('insert into career (name, institute) select ?, ? from dual where not exists (select * from career where name = ?)', [request.fields.name, request.fields.institute, request.fields.name], (error, result) => {
            if( error )
                response.sendStatus(500);
            else {
                if( result.affectedRows == 0 )
                    response.status(400).json({status:400, added:false, msg:'career already exists'});
                else
                    response.status(200).json({status:200, added:true, msg:'career added succesfully'});
            }
        });
    }
})

router.delete('/:id', (request, response) => {
    db.query('delete from career where id = ?', request.params.id, (error, result) => {
        if( error )
            response.sendStatus(500);
        else {
            if( result.affectedRows == 0 )
                response.status(400).json({status:400, deleted:false, msg:"career not exists"});
            else
                response.status(200).json({status:200, deleted:true, msg:"career deleted successfully"});
        }
    });
})

router.put('/:id', (request, response) => {
    if( !request.fields.name || !request.fields.institute )
        response.sendStatus(400).json({status:400, added:false, msg:'invalid body'});
    else {
        db.query('update user set name = ?, institute = ? where name = ?', [request.fields.newName || request.fields.name, request.fields.institute, request.fields.name], (error, result) => {
            if( error )
                response.sendStatus(500);
            else {
                if( result.affectedRows == 0 )
                    response.status(400).json({status:400, updated:false, msg:'career not exists'});
                else
                    response.status(200).json({status:200, updated:true, msg:'career updated succesfully'});
            }
        })
    }
});

module.exports = router;