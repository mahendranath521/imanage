const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const stackRouter = require('./routes/stack');

app.use('/api/v1/stack',stackRouter);


app.listen(port,console.log(`Server running in ${port}`))