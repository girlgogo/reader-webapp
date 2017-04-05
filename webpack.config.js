var webpack = require('webpack')
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	context: path.resolve(__dirname,'./src'),
	entry: {
		'js/build': './js/main.js',
		'vendor': 'jquery'
	},
	devtool: 'cheap-module-source-map',
	module: {
		rules: [
			{
				test: /\.css/,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html'
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		new webpack.optimize.CommonsChunkPlugin({
			cache: true,
			names: ['vendor'],
			filename: "js/common-[hash].js"
		})
	],
	output: {
		filename: '[name]-[hash].js',
		path: path.resolve(__dirname,'dist')
	},
};
