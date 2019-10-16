const path = require("path");

module.exports = {
    devtool: "eval-source-map",
    output: {
        library: 'one_report_web',
        filename: "bundle.js",
        path: path.resolve(__dirname, 'backend/server/static')
    },
    devServer: {
        contentBase: path.join(__dirname, './backend/server/'),
        publicPath: '/static/',
        watchContentBase: true,
        host: "0.0.0.0",
        disableHostCheck: true,
        port: 9010,
        proxy: {
            '!(/static/**/**.*)': {
                target: 'http://0.0.0.0:8443',
            },
        },
    },
    entry: {
        // 'html/home': './backend/sdarot_downloader/templates/index.html',
        'js/main': "./frontend/index.js"
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                include: path.resolve(__dirname, "frontend"),
                loader: "babel-loader"
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
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
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    priority: -10,
                    test: /[\\/]node_modules[\\/]/
                }
            },

            chunks: 'async',
            minChunks: 1,
            minSize: 30000,
            name: true
        }
    }
}