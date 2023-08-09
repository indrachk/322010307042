const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls) {
    return res.status(400).json({ error: 'No URLs provided' });
  }

  const urlList = Array.isArray(urls) ? urls : [urls];
  const promises = [];

  for (const url of urlList) {
    promises.push(
      axios.get(url, { timeout: 500 })
        .then(response => response.data.numbers)
        .catch(error => {
          console.error(`Error fetching ${url}: ${error.message}`);
          return [];
        })
    );
  }

  try {
    const results = await Promise.all(promises);
    const mergedNumbers = results.flat().filter((value, index, self) => self.indexOf(value) === index).sort((a, b) => a - b);
    res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error(`Error processing requests: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`number-management-service is running on port ${port}`);
});
