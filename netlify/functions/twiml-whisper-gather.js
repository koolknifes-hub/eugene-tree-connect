const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;

exports.handler = async (event, context) => {
    const twiml = new VoiceResponse();

    // Acknowledge the key press and connect
    twiml.say('Connecting you now.');

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/xml' },
        body: twiml.toString()
    };
};
