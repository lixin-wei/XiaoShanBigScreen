const webpack = require('webpack');

module.exports = {
    entry: './js/app.js',
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map"
        })
    ],
    output: {
        filename: './dist/app.js'
    },
    devtool: 'source-map'
};

