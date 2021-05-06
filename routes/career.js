const express = require('express');
const router = express.Router();
const careerService = require('./../services/careerService');

router.get('/', (req, res) => {
    res.status(200).json( careerService.getAllCareers() );
});

router.get('/:id', (req, res) => {
    res.status(200).json( careerService.getCareer(req.params.id) );
});

router.post('/', (req, res) => {
    console.log(req.body);
    res.status(200).json( careerService.addCareer(req.fields.name, req.fields.institute) );
})

router.delete('/:id', (req, res) => {
    res.status(200).json( careerService.removeCareer(req.params.id) );
})

module.exports = router;