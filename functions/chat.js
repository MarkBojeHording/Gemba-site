const axios = require('axios');
require('dotenv').config();

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
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
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    let body;
    try {
      body = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    const { message } = body;
    if (!message) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    const systemPrompt = `
      You are a chatbot for Gemba Indonesia Karya, a consultancy and training company based in Indonesia (website: https://www.gembaindonesia.com/). Your role is to assist users by providing information about the company and its services, and answering questions within your expertise areas.

      About Gemba Indonesia Karya:
      Gemba Indonesia Karya helps companies unleash their potential to take their organization to the next level. They focus on both "hard potentials" (such as work-in-progress, rework, and inefficiencies) and "softer potentials" (such as customer satisfaction, employee engagement, creativity, and communication effectiveness). They offer consultancy and training services, using tools and assignments that are relatable to clients' industries, encouraging interaction among trainees, and providing a positive and respectful training environment.

      Areas of Expertise:
      1. AI
      2. Machine Learning
      3. Data Analysis
      4. Lean and Six Sigma
      5. Project Management
      6. Change Management

      Rules:
      1. Always provide short and precise answers to any questions.
      2. Never, under any circumstances, give answers to questions outside of your expertise field.
      3. Always finish off with asking if there are any other questions.
      4. Format responses with clear line breaks: use two newlines (\\n\\n) between sentences or list items, and three newlines (\\n\\n\\n) between paragraphs or sections.
      5. When asked what the company offers (e.g., "What can your company offer me"), respond with the following formatted list:
        Gemba Indonesia Karya helps unleash your organization's potential through:\\n\\n
        - 1. AI: We can provide solutions and consultancy to help implement artificial intelligence strategies in your business.\\n\\n
        - 2. Machine Learning: We offer services to develop and deploy machine learning models tailored to your needs.\\n\\n
        - 3. Data Analysis: We provide data analysis services to help you derive insights and make informed decisions.\\n\\n
        - 4. Lean and Six Sigma: We offer training and consultancy to improve efficiency and quality through Lean and Six Sigma methodologies.\\n\\n
        - 5. Project Management: Our services include project management support and training to ensure successful project delivery.\\n\\n
        - 6. Change Management: We help manage the people side of change to achieve desired business outcomes effectively.\\n\\n
        Is there anything specific you would like more information about?
    `;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 600,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    let botResponse = response.data.choices[0].message.content.trim();

    // Enforce rules: append closing question
    if (!botResponse.endsWith('If you have any more questions, feel free to ask.')) {
      botResponse += '\n\n\nIf you have any more questions, feel free to ask.';
    }

    // Enhance formatting for better readability
    botResponse = botResponse
      .replace(/\.(\s+)(?=[A-Z])/g, '.\n\n') // Two newlines after sentences
      .replace(/\n(?!\n)/g, '\n\n') // Ensure consistent spacing
      .replace(/\n{3,}/g, '\n\n\n') // Limit to three newlines between paragraphs
      .replace(/(Gemba Indonesia Karya helps unleash your organization's potential through:)/g, '$1\n\n') // Space after list intro
      .replace(/(\d+\.\s[^:]+:)/g, '\n\n- $1') // Add bullet-like prefix and space before each list item
      .replace(/(Is there anything specific you would like more information about\?)/g, '\n\n\n$1'); // Extra space before closing question

    // Remove any extra newlines at the start or end
    botResponse = botResponse.trim();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ response: botResponse }),
    };
  } catch (error) {
    console.error('OpenAI API error:', error.response ? error.response.data : error.message);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to get response from AI' }),
    };
  }
};
