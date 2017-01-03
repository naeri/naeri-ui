const path = require('path');
const buildWebpack = require('webpack-build');

function build(callback) {
	buildWebpack({
		config: path.join(__dirname, 'webpackBuild.config.js')
	}, callback);
}

exports.build = build;