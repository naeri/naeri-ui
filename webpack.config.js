const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
    entry: path.join(__dirname, 'src', 'js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                include: path.join(__dirname, 'src', 'js'),
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    'style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]'
                ),
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    'style', 'css'
                ),
                include: path.join(__dirname, 'node_modules')
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('css/style.css', {
            allChunks: true
        })
    ],
    devServer: {
        proxy: {
            '/api/**': {
                target: 'http://localhost:8000'
            }
        }
    },
    devtool: 'source-map'
}