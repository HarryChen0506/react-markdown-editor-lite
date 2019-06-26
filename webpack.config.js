const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const config = {
  entry: {
    app: './example/index.jsx',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    port: '8080',
    host: '0.0.0.0', //支持ip来访问页面，否则只能通过localhost:8080来访问
    historyApiFallback: true, //所有404页面能跳转到index.html
    hot: true
  },
  module: {
    rules: [{
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [{
          loader: "ts-loader"
        }]
      },
      {
        test: /\.(js|jsx)$/,
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
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader',
          'less-loader'
        ]
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        test: /\.(png|svg|jpg|gif|eot|woff|ttf)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
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