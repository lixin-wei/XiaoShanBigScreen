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
    // module: {
    //     loaders: [
    //         {
    //             test: /\.js$/,
    //             loader: 'babel-loader',
    //             query: {
    //                 presets: ['es2015']
    //             }
    //         }
    //     ]
    // },
    devtool: 'source-map'
};

