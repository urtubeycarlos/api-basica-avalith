const express = require('express');
const session = require('express-sesion');
const md5 = require('md5');

const port = process.env.port;
const app = express();

const autRouter = require('./routes/auth');
const careerRouter = require('./routes/career');
app.use('/', autRouter);
app.use('/career', careerRouter);

app.listen(port, () => {
    console.log(`Server listening in port: ${port}`);
})