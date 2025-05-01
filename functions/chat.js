const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

exports.handler = async (event) => {
  console.log('Function invoked with event:', event);

  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    };
  }

  if (event.httpMethod !== 'POST') {
    console.log('Invalid method:', event.httpMethod);
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('Checking API key');
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log('Parsing request body');
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    const { message } = body;
    if (!message) {
      console.log('No message provided');
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    console.log('Sending request to OpenAI with message:', message);
    const systemPrompt = `
      You are a virtual assistant for Gemba Indonesia, an expert in:
      1. AI and Machine Learning
      2. Data Analysis
      3. Lean and Six Sigma
      4. Project Management
      5. Change Management
      6. Process Optimization

      Provide concise, professional responses focused on these areas.
      Always be helpful and maintain a friendly, professional tone.
    `;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    console.log('OpenAI response received:', response.data);
    let botResponse = response.data.choices[0].message.content.trim();
    if (!botResponse.endsWith('If you have any more questions, feel free to ask.')) {
      botResponse += '\n\n\nIf you have any more questions, feel free to ask.';
    }
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ response: botResponse }),
    };
  } catch (error) {
    console.error('Function error:', {
      message: error.message,
      stack: error.stack,
      response: error.response ? error.response.data : null,
    });
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to process request',
        details: error.message,
        type: error.name,
      }),
    };
  }
};
