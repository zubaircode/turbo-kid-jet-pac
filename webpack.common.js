const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = {
    entry: "./src/index.js",
    module: {
        rules: [],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "src/assets", to: "assets" }
            ]
        }),
    ],
};
