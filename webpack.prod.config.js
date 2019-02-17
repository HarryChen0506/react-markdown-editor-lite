const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const config = {
  entry: {
    app: './src/index.js',
  },
  output: {
    filename: 'rc-md2html.min.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: "umd"
  },  
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader', 
          'css-loader', 
          'less-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|eot|woff|ttf)$/, 
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['lib']),
  ],
};

module.exports = config;