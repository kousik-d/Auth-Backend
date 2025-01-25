require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {PORT} = process.env;
const port = 8080 || env.PORT;

const twilioRouter = require('./twilio-sms');
const stripe = require('stripe')(process.env.STRIPE_SERIVCE_ID);

const jsonParser = bodyParser.json();
app.use(jsonParser);

const cors = require('cors');
app.use(cors());


app.use("/twilio-sms",twilioRouter);

app.get("/",(req,res)=>{
    res.send("hello");
});

app.post('/create-checkout-session', async (req, res) => {
    const { amount, currency, name } = req.body;
    console.log(amount, currency, name);
const session = await stripe.checkout.sessions.create({
    line_items: [{
    price_data: {
        currency: currency,
        product_data: {
        name: name,
        },
        unit_amount: amount,
    },
    quantity: 1,
    }],
    mode: 'payment',
    ui_mode: 'embedded',
    return_url: 'http://localhost:3000/payment-success',
});

res.send({clientSecret: session.client_secret});
});

app.get('/session_status', async (req, res) => {
const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

res.send({
    status: session.status,
    payment_status: session.payment_status,
    customer_email: session.customer_details.email
});
});

app.listen(port,()=>{
    console.log(`server is running on ${port}`);
});