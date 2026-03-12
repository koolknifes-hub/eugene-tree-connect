const twilio = require('twilio');

exports.handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        const { name, phone, email, zip, contact, service, description } = data;

        // Configuration: Use API Key/Secret if present, else SID/Token
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const apiKey = process.env.TWILIO_API_KEY || accountSid;
        const apiSecret = process.env.TWILIO_API_SECRET || process.env.TWILIO_AUTH_TOKEN;
        const twilioClient = twilio(apiKey, apiSecret, { accountSid });

        // Hardcoded testing numbers for the Find My Pro form
        const providerPhones = ['+19076024225'];
        const twilioFromNumber = '+15417958733';

        // Message Bodies
        const descText = description ? `\nDetails: ${description}` : '';
        const smsMessage = `NEW LEAD: ${service} in ${zip}. Name: ${name}, Phone: ${phone}. ${descText}\nReply ASAP! - Eugene Tree Connect`;

        // 1. Send SMS to all providers
        if (process.env.TWILIO_ACCOUNT_SID) {
            const smsPromises = providerPhones.map(number =>
                twilioClient.messages.create({
                    body: smsMessage,
                    from: twilioFromNumber,
                    to: number.trim()
                }).catch(e => console.error(`SMS Error to ${number}:`, e))
            );
            await Promise.all(smsPromises);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Lead routed successfully' })
        };
    } catch (error) {
        console.error('Function Error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Server error parsing request' }) };
    }
};
