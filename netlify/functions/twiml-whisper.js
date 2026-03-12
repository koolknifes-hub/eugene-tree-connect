const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;

exports.handler = async (event, context) => {
    const twiml = new VoiceResponse();

    // The whisper message heard by the contractor when they pick up
    twiml.say('New free lead from Eugene Tree Connect. Press any key to accept.');
    twiml.gather({
        numDigits: 1,
        action: '/.netlify/functions/twiml-whisper-gather',
        timeout: 5
    });

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/xml' },
        body: twiml.toString()
    };
};
