import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export const handler = async (event, context) => {
    // Only allow POST requests
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
            You are an expert in the following subjects:
            1. AI
            2. Machine Learning
            3. Data Analysis
            4. Lean and Six Sigma
            5. Project Management
            6. Change Management

            Rules:
            2. Always provide short and precise answers to any questions.
            3. Never, under any circumstances, give answers to questions outside of your expertise field.
            4. Always finish off with asking if there are any other questions.
            5. Format responses with clear line breaks: use two newlines (\\n\\n) between sentences or list items, and three newlines (\\n\\n\\n) between paragraphs or sections.
        `;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
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

        if (!botResponse.endsWith('If you have any more questions, feel free to ask.')) {
            botResponse += '\n\n\nIf you have any more questions, feel free to ask.';
        }

        // Add extra newlines for sentences and paragraphs
        botResponse = botResponse
            .replace(/\.(\s+)(?=[A-Z])/g, '.\n\n') // Two newlines after sentences
            .replace(/\n(?!\n)/g, '\n\n') // Ensure consistent paragraph spacing
            .replace(/\n{3,}/g, '\n\n\n'); // Limit to three newlines between paragraphs

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
        console.error('OpenAI API error:', error.response ? error.response.data : error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to get response from AI' })
        };
    }
};
