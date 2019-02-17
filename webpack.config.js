const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const config = {
  entry: {
    app: './example/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    port: '8080',
    host: '0.0.0.0',  //支持ip来访问页面，否则只能通过localhost:8080来访问
    historyApiFallback: true,  //所有404页面能跳转到index.html
    hot: true
  },
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
                limit: 10000
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './public/index.html'),
      filename: 'index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
};

module.exports = config;