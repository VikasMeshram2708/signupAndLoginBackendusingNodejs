const express = require('express');
const volleyball = require('volleyball');
const dotenv = require('dotenv');
const app = express();
dotenv.config({path:'./.env'})
const port = process.env.PORT;

app.use(volleyball);
app.use(express.json());

app.use(require('./Routes/routes'));
app.listen(port,()=>{
    console.log(`Listening at http://localhost:${port}`);
});


