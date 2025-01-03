const express = require('express');

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;  
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_SERVICE_ID = process.env.TWILIO_SERVICE_SID
const client = require('twilio')(TWILIO_ACCOUNT_SID , TWILIO_AUTH_TOKEN ,{
    lazyLoading: true
})

//for send otp
const sendOtp = async(req,res)=>{
    const {countryCode,phone} = req.body;
    try{
        console.log(req.body)
        if (countryCode === undefined || phone === undefined) {
            return res.status(400).send("Invalid request body");
        }
        console.log(countryCode, phone)
        const otpResponse = await client.verify.v2.services(TWILIO_SERVICE_ID).verifications.create({
            to: `+${countryCode}${phone}`,
            channel: "sms"
        })
        res.status(200).send(`OTP sent successfully: ${JSON.stringify(otpResponse)}`)
    } catch(err) {
        res.status(500).send(err)
    }
}

const verifyOtp = async(req, res)=>{
    const {countryCode, phone, otp} = req.body;
    try{
        console.log(countryCode,phone,otp)
        const verifiedResponse = await client.verify.v2.services(TWILIO_SERVICE_ID).verificationChecks.create({
            to: `+${countryCode}${phone}`,
            code: otp
        })
        res.status(200).send(`OTP verified successfully: ${JSON.stringify(verifiedResponse)}`)
    } catch(err) {
        res.status(500).send(err)
    }
}


const router = express.Router();
router.route('/send-otp').post(sendOtp);
router.route('/verify-otp').post(verifyOtp);

module.exports = router;
