const express = require('express');
const session = require('express-session');
const formidableMiddleware = require('express-formidable');
const authMiddleware = require('./middlewares/auth');

const port = process.env.PORT || 8080;
const app = express();

app.use(session({ secret: 'somevalue' }));
app.use(formidableMiddleware())

const authRouter = require('./routes/auth');
const careerRouter = require('./routes/career');
app.use('/', authRouter);
app.use('/career', authMiddleware, careerRouter);

app.listen(port, () => {
    console.log(`Server listening in port: http://localhost:${port}/`);
})