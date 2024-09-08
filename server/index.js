const PORT = 8001;

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://app-usepopcorn-server-erhan-ertem.onrender.com'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200, // For legacy browser support
};

// Use the cors middleware with options
app.use(cors(corsOptions));

app.get('/', cors(corsOptions), (req, res) => {
  res.json('You hit the usePopCorn server. Good show!');
});

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
