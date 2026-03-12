const http = require('http');

async function testWebhook(path, method = 'POST', payload = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8888, // Default Netlify Dev port
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (method === 'POST') {
      const body = new URLSearchParams(payload).toString();
      req.write(body);
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting Webhook Tests ---');
  
  try {
    console.log('\n[Test 1] Testing /twiml-whisper');
    const whisperRes = await testWebhook('/.netlify/functions/twiml-whisper', 'POST', {
      CallSid: 'CA1234567890abcdef1234567890abcdef',
      From: '+15551234567',
      To: '+15559876543'
    });
    console.log(`Status Code: ${whisperRes.statusCode}`);
    console.log('Response Body:');
    console.log(whisperRes.data);
    
    console.log('\n[Test 2] Testing /twiml-whisper-gather (User pressed 1)');
    const gatherRes = await testWebhook('/.netlify/functions/twiml-whisper-gather', 'POST', {
      CallSid: 'CA1234567890abcdef1234567890abcdef',
      Digits: '1'
    });
    console.log(`Status Code: ${gatherRes.statusCode}`);
    console.log('Response Body:');
    console.log(gatherRes.data);

    console.log('\n--- Webhook Tests Completed successfully! ---');

  } catch (err) {
    console.error('\n[Error] Test failed:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.log('Please make sure your local dev server (netlify dev) is running on port 8888.');
    }
  }
}

runTests();
