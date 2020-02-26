const path = require('path');

module.exports = {
	entry: './src/TaxYears/17-18/Calculator.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'tax-calculator.js',
		library: 'TaxCalculator',
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: 'es2015',
							plugins: [ 'transform-object-assign' ]
						}
					},
					{
						loader: 'ts-loader'
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: 'es2015',
							plugins: [ 'transform-object-assign' ]
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: [ '.ts', '.json', '.js' ]
	}
};
