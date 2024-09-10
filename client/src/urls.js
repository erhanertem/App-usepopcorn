const production = {
  url: 'https://app-usepopcorn-api-erhan-ertem.onrender.com',
};
const development = {
  url: 'http://localhost:8001',
};

const config = process.env.REACT_APP_NODE_ENV === 'development' ? development : production;

const URL = config.url;

export default URL;
