const path = require('path');

module.exports = {
  mode: 'development',

  devtool: 'source-map',

  target: 'web',

  resolve: {
    extensions: ['.js'],
    modules: [path.resolve(__dirname, 'node_modules')],
  },

  output: {
    filename: '[name].js',
    chunkFilename: '[name].bundle.js',
    path: path.join(__dirname, '__build/assets'),
    publicPath: '/',
  },
};
