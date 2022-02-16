'use strict';
const express = require('express');
const bodyParser = require('body-parser')
const fetch = require('node-fetch');
const app = express()
const port = 3008

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from AcendAI!</h1>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => {
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



app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));


module.exports = app;
module.exports.handler = serverless(app);
