const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const version = require("./package.json").version;
const banner =
  "/**\n" +
  " * rc-md2html v" + version + "\n" +
  " * https://github.com/HarryChen0506/rc-md2html\n" +
  " * MIT License\n" +
  " */\n";
const config = {
  entry: {
    app: './src/index.js',
  },
  output: {
    filename: 'rc-md2html.min.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: "umd"
  },  
  externals: [
    {
      react: 'react',    
    },
    {
      ['react-dom']: 'react-dom', 
    },
    /^markdown-it.*$/i
  ],
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
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader', 
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|eot|woff|ttf)$/, 
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 20000,
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['lib']),
    new webpack.BannerPlugin({banner, raw: false})
  ],
};

module.exports = config;