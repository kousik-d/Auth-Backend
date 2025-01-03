require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {PORT} = process.env;
const port = 8080 || env.PORT;

const twilioRouter = require('./twilio-sms');

const jsonParser = bodyParser.json();
app.use(jsonParser);

const cors = require('cors');
app.use(cors());


app.use("/twilio-sms",twilioRouter);

app.get("/",(req,res)=>{
    res.send("hello");
});

app.listen(port,()=>{
    console.log(`server is running on ${port}`);
});