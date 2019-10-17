const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin'); 

module.exports = {
    output: {
        library: 'one_report_web',
        filename: "bundle.js",
        path: path.resolve(__dirname, 'frontend/dist')
    },
    entry: {
        'js/main': "./frontend/src/index.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'frontend/src/', 'index.html')
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