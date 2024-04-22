const express = require('express');
const axios = require('axios');
const { twiml } = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/twist', (req, res) => {
  const { url } = req.query;

  if (!url) {
    res.status(400).send('Error: Audio URL is required');
    return;
  }

  const twimlResponse = new twiml.VoiceResponse();
  twimlResponse.play(url);

  const xmlResponse = twimlResponse.toString();

  res.status(200)
    .type('text/xml')
    .send(xmlResponse);
});

app.get('/stream', async (req, res) => {
  try {
    const audioFileURL = req.query.url;

    if (!audioFileURL) {
      res.status(400).send('Error: Audio URL is required');
      return;
    }

    const audioResponse = await axios.get(audioFileURL, {
      responseType: 'stream'
    });

    res.set({
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-cache',
      'Transfer-Encoding': 'chunked'
    });

    audioResponse.data.pipe(res);
  } catch (error) {
    console.error('Error streaming audio:', error);
    res.status(500).send('Error streaming audio');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
