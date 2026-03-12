const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;

exports.handler = async (event, context) => {
    const twiml = new VoiceResponse();

    // Read the list of provider phone numbers from env vars
    const providerPhones = (process.env.PROVIDER_PHONES || '+15550001111,+15550002222').split(',');

    // We use the <Dial> verb to ring them all simultaneously
    const dial = twiml.dial({
        callerId: process.env.TWILIO_PHONE_NUMBER || '+15417958733',
        timeout: 20 // Ring for 20 seconds before giving up
    });

    providerPhones.forEach(number => {
        // Add each number, and attach a whisper URL so the provider hears it before connecting to the client
        dial.number({
            url: '/.netlify/functions/twiml-whisper'
        }, number.trim());
    });

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/xml' },
        body: twiml.toString()
    };
};
