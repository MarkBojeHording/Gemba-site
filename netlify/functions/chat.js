import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export const handler = async (event, context) => {
    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { message } = JSON.parse(event.body);

        if (!message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Message is required' })
            };
        }

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
                model: 'gpt-3.5-turbo', // Using GPT-3.5-turbo instead of GPT-4
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: 500,
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

        // Add a polite closing if not present
        if (!botResponse.toLowerCase().includes('can i help')) {
            botResponse += '\n\nIs there anything else I can help you with?';
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ response: botResponse })
        };

    } catch (error) {
        console.error('Error details:', error);

        // More detailed error handling
        const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown error occurred';

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Failed to get response from AI',
                details: errorMessage
            })
        };
    }
};
