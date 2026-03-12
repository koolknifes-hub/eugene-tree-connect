exports.handler = async (event) => {
    // This is the message played ONLY to the contractor before the call is connected to the customer
    const twilio = require('twilio');
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();

    response.say("New exclusive lead from Eugene Tree Connect. Connecting you now.");

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/xml'
        },
        body: response.toString()
    };
};
