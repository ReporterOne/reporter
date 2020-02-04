const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');


const frontend = path.resolve(__dirname, 'app', 'frontend');
const dist = path.resolve(frontend, 'dist');
const src = path.resolve(frontend, 'src');

module.exports = {
  output: {
    library: 'one_report_web',
    filename: 'static/[name].js',
    path: dist,
    publicPath: '/',
  },
  entry: {
    main: path.resolve(src, 'index.js'),
    avatars: path.resolve(src, 'assets', 'avatars', 'index.js'),
    fonts: path.resolve(src, 'assets', 'fonts', 'index.js'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(src, 'index.html'),
    }),
    new CopyPlugin([
      {
        from: path.resolve(src, 'manifest.json'),
        to: path.resolve(dist, 'static'),
      },
    ]),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      "~": path.resolve(src),
      "@": path.resolve(src, 'screens'),
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.inline.svg$/,
        loader: 'react-svg-loader',
      },
      {
        test: /^(?!.*\.inline\.svg$).*\.svg$/,
        loader: 'svg-url-loader',
        options: {
          limit: 10000,
          name: '/static/[name].[ext]',
        },
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'static/img/',
          publicPath: '/static/img/',
        },
      },
      {
        test: /\.(ttf)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'static/font/',
          publicPath: '/static/font/',
        },
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
