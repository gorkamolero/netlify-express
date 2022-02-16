const express = require('express');
const bodyParser = require('body-parser')
const fetch = require('node-fetch');
const app = express()
const port = 3008

app.use(bodyParser.json());

app.post('/api/generate', (req, res) => {
  var PROMPT = req.body.subject;
  var raw = JSON.stringify({"prompt": PROMPT, "max_tokens": 5 });

  var requestOptions = {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: raw,
    redirect: 'follow'
  };

  fetch("https://api.openai.com/v1/engines/davinci/completions", requestOptions)
    .then(response => response.json())
    .then(json => {
      res.status(200).json(json);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('An error occurred');
    })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
