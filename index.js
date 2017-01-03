const path = require('path');
const webpack = require('webpack');

const config = require('./webpack.config.js');

function build(callback) {
	webpack(config, callback);
}

exports.build = build;