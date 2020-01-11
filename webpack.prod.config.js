const path = require('path')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const version = require('./package.json').version
const banner =
  ' react-markdown-editor-lite v' + version + '\n' +
  ' https://github.com/HarryChen0506/react-markdown-editor-lite\n' +
  ' MIT License\n'
const config = {
  entry: {
    index: './src/index',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'umd'
  },
  externals: [{
    react: 'react',
  },
  {
    ['react-dom']: 'react-dom',
  }
  ],
  mode: 'production',
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      loader: 'babel-loader',
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
    {
      test: /\.(png|svg|jpg|gif|eot|woff|ttf)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 20000,
        }
      }]
    }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin({
      banner,
      raw: false
    }),
    new CopyWebpackPlugin([{
      from: 'src/index.d.ts'
    }])
  ],
}

module.exports = config
