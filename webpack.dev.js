const path = require("path");
const merge = require('webpack-merge');
const common = require('./webpack.common.js');


module.exports = merge(common, {
    devtool: "eval-source-map",
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, 'frontend/dist'),
        watchContentBase: true,
        host: "0.0.0.0",
        disableHostCheck: true,
        port: 8000,
        proxy: [{
            context: ["/api", "/docs", "/openapi.json", "/redoc"],
            target: 'http://0.0.0.0:8443'
        }],
    },
});
