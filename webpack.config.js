const path = require('path');
const Dotenv = require('dotenv-webpack');
module.exports = {
  entry: './src/index.js', // or wherever your entry point is
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new Dotenv(), // This is where the dotenv-webpack plugin is added
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
