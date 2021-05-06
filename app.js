const express = require('express');
const session = require('express-session');
const md5 = require('md5');

const port = process.env.PORT || 8080;
const app = express();

app.use(session({}));

const autRouter = require('./routes/auth');
const careerRouter = require('./routes/career');
app.use('/', autRouter);
app.use('/career', careerRouter);

app.listen(port, () => {
    console.log(`Server listening in port: http://localhost:${port}/`);
})