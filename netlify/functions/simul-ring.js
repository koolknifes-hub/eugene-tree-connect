exports.handler = async (event) => {
    // This endpoint acts as a webhook for Twilio. 
    // When a customer calls the 541-795-TREE number, Twilio hits this URL.
    // We return TwiML (Twilio Markup Language) instructing it to dial the contractor.

    const twilio = require('twilio');
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();

    // The user's requested testing phone number
    const contractorPhone = '+19076024225';

    // Dial the number using the Twilio number as the Caller ID (req. for Trial accounts)
    const dial = response.dial({
        callerId: process.env.TWILIO_PHONE_NUMBER || '+15417958733'
    });

    // Include the "Whisper" message so the contractor knows the lead came from us
    dial.number({
        url: '/.netlify/functions/whisper-message' // Custom URL that plays the whisper
    }, contractorPhone);

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/xml'
        },
        body: response.toString()
    };
};
