const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: 'eval',
  entry: {
    index: process.env.NODE_ENV === 'development'? [
      'webpack-dev-server/client?',
      './src/client'
    ]:['./src/client'],
    '404': ['ghspa']
  },
  output: {
    path: path.join(__dirname),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
		publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.css', '.ts', '.tsx', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.mov', '.ttf', '.eot', '.woff', '.woff2']
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [{
        loader: 'ts-loader'
      }]
    }, {
      test: /\.(jpe?g|png|gif|svg|mov|ttf|eot|woff2?)$/,
      use: [{
        loader: 'file-loader',
        options: {
          hash: 'sha512',
          digest: 'hex',
          name: '[hash].[ext]'
        }
      }]
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/client/index.html',
      chunks: ['index', '404']
    }),
    new HtmlWebpackPlugin({
      filename: '404.html',
      template: 'src/client/404.html',
      chunks: ['404']
    }),
    new CopyWebpackPlugin([{
      from: 'src/asset/static/**/*',
      to: '[name].[ext]'
    }])
  ]
}
