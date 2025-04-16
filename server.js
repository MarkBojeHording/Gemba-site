import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';

dotenv.config();
console.log('API Key:', process.env.OPENAI_API_KEY ? 'Loaded' : 'Not found');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Gemba Indonesia Karya Chatbot API is running. Use POST /api/chat for chatbot requests.' });
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  console.log('Received message:', message);

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
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
    1. Always start with: Hello, I am the Gemba Indonesia SME chatbot, how may I assist you?
    2. Always provide short and precise answers to any questions.
    3. Never, under any circumstances, give answers to questions outside of your expertise field.
    4. Always finish off with asking if there are any other questions.
    5. Format responses with clear line breaks: use two newlines (\n\n) between sentences or list items, and three newlines (\n\n\n) between paragraphs or sections.
  `;

  try {
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

    // Enforce rules: prepend greeting, append question, and enhance formatting
    if (!botResponse.startsWith('Hello, I am the Gemba Indonesia SME chatbot')) {
      botResponse = 'Hello, I am the Gemba Indonesia SME chatbot, how may I assist you?\n\n\n' + botResponse;
    }
    if (!botResponse.endsWith('If you have any more questions, feel free to ask.')) {
      botResponse += '\n\n\nIf you have any more questions, feel free to ask.';
    }

    // Add extra newlines for sentences and paragraphs
    botResponse = botResponse
      .replace(/\.(\s+)(?=[A-Z])/g, '.\n\n') // Two newlines after sentences
      .replace(/\n(?!\n)/g, '\n\n') // Ensure consistent paragraph spacing
      .replace(/\n{3,}/g, '\n\n\n'); // Limit to three newlines between paragraphs

    res.json({ response: botResponse });
  } catch (error) {
    console.error('OpenAI API error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
