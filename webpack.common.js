const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


const frontend = path.resolve(__dirname, 'app', 'frontend');
const dist = path.resolve(frontend, 'dist');
const src = path.resolve(frontend, 'src');

module.exports = {
    output: {
        library: 'one_report_web',
        filename: "static/bundle.js",
        path: dist
    },
    entry: {
        'js/main': path.resolve(src, 'index.js')
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(src, 'index.html'),
        })
    ],
    resolve: {
      alias: {
        Root: path.resolve(src)
      }
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                loader: "babel-loader",
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
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