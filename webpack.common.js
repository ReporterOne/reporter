const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin'); 

const frontend = path.resolve(__dirname, 'app', 'frontend');
const dist = path.resolve(frontend, 'dist');
const src = path.resolve(frontend, 'src');

module.exports = {
    output: {
        library: 'one_report_web',
        filename: "bundle.js",
        path: dist 
    },
    entry: {
        'js/main': path.resolve(src, 'index.js')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(src, 'index.html')
        })
    ],
    module: {
        rules: [
            {
                test: /\.jsx?/,
                loader: "babel-loader"
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                    outputPath: "img/",
                    publicPath: "static/img/"
                }
            },
            {
                test: /\.(ttf)$/i,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                    outputPath: "font/",
                    publicPath: "static/font/"
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