const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


const frontend = path.resolve(__dirname, 'app', 'frontend');
const dist = path.resolve(frontend, 'dist');
const src = path.resolve(frontend, 'src');

module.exports = {
  output: {
    library: 'one_report_web',
    filename: "static/[name].js",
    path: dist
  },
  entry: {
    main: path.resolve(src, 'index.js'),
    avatars: path.resolve(src, 'assets', 'avatars', 'index.js'),
    fonts: path.resolve(src, 'assets', 'fonts', 'index.js')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(src, 'index.html'),
    }),
    new CopyPlugin([
      { from: path.resolve(src, 'manifest.json'), to: path.resolve(dist, 'static') }
    ])
  ],
  resolve: {
    alias: {
      "~": path.resolve(src),
      "@": path.resolve(src, 'screens'),
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "static/img/",
          publicPath: "/static/img/"
        }
      },
      {
        test: /\.(ttf)$/i,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "static/font/",
          publicPath: "/static/font/"
        }
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}