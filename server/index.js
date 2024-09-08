const PORT = 8001;

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.get('/movies/:query', cors(corsOptions), (req, res) => {
  const options = {
    method: 'GET',
    url: `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_APIKEY}&s=${req.params.query}`,
    headers: { 'Content-Type': 'application/json' },
  };
  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => console.error(error));
});
app.get('/movies/id/:selectedId', cors(corsOptions), (req, res) => {
  const options = {
    method: 'GET',
    url: `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_APIKEY}&i=${req.params.selectedId}`,
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
