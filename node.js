// ... existing code ...
import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Your system prompt here' },
        { role: 'user', content: req.body.message }
      ],
      max_tokens: 150,
      temperature: 0.7
    }, {
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
    });
    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'API error' });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
// ... existing code ...
