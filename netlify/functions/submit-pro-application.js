const twilio = require('twilio');

exports.handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        const { businessName, contactName, phone, email, ccbNumber, insurance, equipment } = data;

        // Configuration
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const apiKey = process.env.TWILIO_API_KEY || accountSid;
        const apiSecret = process.env.TWILIO_API_SECRET || process.env.TWILIO_AUTH_TOKEN;
        const twilioClient = twilio(apiKey, apiSecret, { accountSid });

        // Hardcoded testing number - this goes to YOU (the boss)
        const adminPhone = '+19076024225';
        const twilioFromNumber = process.env.TWILIO_PHONE_NUMBER || '+15417958733';

        // Message Body
        const smsMessage = `NEW PRO APPLICATION:\nBiz: ${businessName}\nName: ${contactName}\nPhone: ${phone}\nCCB: ${ccbNumber}\nIns: ${insurance}\nEquip: ${equipment}`;

        // Send SMS to admin
        if (process.env.TWILIO_ACCOUNT_SID) {
            await twilioClient.messages.create({
                body: smsMessage,
                from: twilioFromNumber,
                to: adminPhone
            });
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Application submitted successfully' })
        };
    } catch (error) {
        console.error('Function Error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Server error parsing request' }) };
    }
};
