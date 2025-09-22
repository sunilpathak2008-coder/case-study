const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const app = express();
app.use(express.json());

app.post('/api/openai', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt);
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    // Uncomment and set OPENAI_API_KEY in your .env for real requests
    // const r = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     model: 'gpt-3.5-turbo',
    //     messages: [{ role: 'user', content: prompt }],
    //     max_tokens: 250,
    //     temperature: 0.7
    //   })
    // });
    // const json = await r.json();

    // Mock response for local/dev
    const json = {
      "id": "chatcmpl-CHQVhixRohbQbXKhdk3lZ9qk5yVIm",
      "object": "chat.completion",
      "created": 1758269517,
      "model": "gpt-3.5-turbo-0125",
      "choices": [
        {
          "index": 0,
          "message": {
            "role": "assistant",
            "content": "- Counseling or therapy services for individuals experiencing hardship\n- Community support programs to help alleviate hardship\n- Financial assistance programs for those in financial hardship\n- Job training and placement programs for individuals facing hardship\n- Educational resources and scholarships for individuals facing hardship.",
            "refusal": null,
            "annotations": []
          },
          "logprobs": null,
          "finish_reason": "stop"
        }
      ],
      "usage": {
        "prompt_tokens": 13,
        "completion_tokens": 50,
        "total_tokens": 63,
        "prompt_tokens_details": {
          "cached_tokens": 0,
          "audio_tokens": 0
        },
        "completion_tokens_details": {
          "reasoning_tokens": 0,
          "audio_tokens": 0,
          "accepted_prediction_tokens": 0,
          "rejected_prediction_tokens": 0
        }
      },
      "service_tier": "default",
      "system_fingerprint": null
    };
    res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`OpenAI proxy listening on ${port}`));
