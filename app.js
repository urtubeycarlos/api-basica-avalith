const express = require('express');
const session = require('express-session');
const formidableMiddleware = require('express-formidable');
const bodyParser = require('body-parser');
const authMiddleware = require('./middlewares/auth');
const authRouter = require('./routes/auth');
const careerRouter = require('./routes/career');

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(session({ secret: 'somevalue' }));
app.use(formidableMiddleware());
app.use('/', authRouter);
/* app.use('/career', authMiddleware, careerRouter); */
app.use('/career', careerRouter);

app.listen(port, () => {
  console.log(`Server listening in port: http://localhost:${port}/`);
});
