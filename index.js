const PORT = 8001;

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.json('You have hit the backend for this project. Good show!');
});

app.get('/movies/:query', (req, res) => {
  const options = {
    method: 'GET',
    url: `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_APIKEY}&s=${req.params.query}`,
    headers: { 'Content-Type': 'application/json' },
  };
  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => console.error(error));
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
