const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/main/main.ts',
    target: 'electron-main',
    module: {
        rules: [{
            test: /\.ts$/,
            include: /src/,
            use: [{ loader: 'ts-loader' }]
        }]
    },
    output: {
        path: path.resolve(__dirname, './dist/main'),
        filename: 'main.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/main/preload.ts', to: 'preload.js' },
                { from: 'src/renderer/public', to: '../renderer' }
            ]
        })
    ]
}; 