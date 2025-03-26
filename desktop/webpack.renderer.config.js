// webpack.renderer.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/renderer/src/index.tsx',
    target: 'electron-renderer',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: /src/,
                use: [{ loader: 'ts-loader' }]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, './dist/renderer'),
        filename: 'renderer.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/renderer/public/index.html'
        })
    ]
};
