const twilio = require('twilio');

exports.handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // Parse the URL-encoded body from Twilio
        const params = new URLSearchParams(event.body);
        
        // DialCallStatus tells us what happened with the <Dial> attempt
        const dialStatus = params.get('DialCallStatus');
        const callerPhone = params.get('From');

        // Twilio configuration for sending SMS
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const apiKey = process.env.TWILIO_API_KEY || accountSid;
        const apiSecret = process.env.TWILIO_API_SECRET || process.env.TWILIO_AUTH_TOKEN;
        const twilioClient = twilio(apiKey, apiSecret, { accountSid });
        const twilioFromNumber = process.env.TWILIO_PHONE_NUMBER || '+15417958733';

        // Check if the call was missed (no-answer, failed, busy, or canceled)
        const missedStatuses = ['no-answer', 'failed', 'busy', 'canceled'];

        if (missedStatuses.includes(dialStatus) && callerPhone) {
            console.log(`Call missed (${dialStatus}). Virtual Receptionist triggered for ${callerPhone}`);
            
            // The Automated Customer Success Script
            const smsMessage = "Hi, this is Eugene Tree Connect! Sorry we missed your call. All of our local arborists are currently on jobs. What is your address and what kind of tree work do you need done today?";

            // Send the SMS
            await twilioClient.messages.create({
                body: smsMessage,
                from: twilioFromNumber,
                to: callerPhone
            });
            console.log("Virtual receptionist SMS sent successfully.");
        } else {
            console.log(`Call answered or finished successfully. Status: ${dialStatus}`);
        }

        // Return empty TwiML to end the voice call gracefully
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/xml' },
            body: '<?xml version="1.0" encoding="UTF-8"?><Response></Response>'
        };

    } catch (error) {
        console.error('Virtual Receptionist Error:', error);
        return { statusCode: 500, body: 'Error triggering agent' };
    }
};
