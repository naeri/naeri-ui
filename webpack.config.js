const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const PROD = (process.env.NODE_ENV === 'production');

const plugins = [
    new ExtractTextPlugin('css/style.css', {
        allChunks: true
    })
];

if (PROD) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    );
}

module.exports = {
    entry: [
        'babel-polyfill',
        path.join(__dirname, 'src')
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                include: [
                    path.join(__dirname, 'src'),
                    path.dirname(require.resolve('koto-parser')),
                    path.dirname(require.resolve('escape-html-whitelist'))
                ],
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: [['resolver', { resolveDirs: [path.join(__dirname, 'src')] }], "transform-async-to-generator"]
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    'style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]'
                ),
                include: path.join(__dirname, 'src')
            }
        ]
    },
    plugins: plugins,
    resolve: {
        alias: {
            commonCss: path.join(__dirname, 'src', 'common')
        }
    },
    devServer: {
        proxy: {
            '/api/**': {
                target: 'http://localhost:8000'
            }
        }
    },
    devtool: 'source-map'
}