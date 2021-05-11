const express = require('express');
const authMiddleware = require('./middlewares/auth');
const authRouter = require('./routes/auth');
const careerRouter = require('./routes/career');

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use('/', authRouter);
app.use('/career', authMiddleware, careerRouter);

app.listen(port, () => {
  console.log(`Server listening in port: http://localhost:${port}/`);
});
