const path = require("path");
const merge = require('webpack-merge');
const common = require('./webpack.common.js');


module.exports = merge(common, {
    devtool: "eval-source-map",
    mode: 'development',
    devServer: {
        contentBase: common.output.path,
        watchContentBase: true,
        host: "0.0.0.0",
        disableHostCheck: true,
        port: 8000,
        hot: true,
        proxy: [{
            context: ["/api", "/docs", "/openapi.json", "/redoc"],
            target: 'http://0.0.0.0:8443'
        }],
    },
});
