const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/renderer/src/index.tsx',
    target: 'electron-renderer',
    module: {
        rules: [{
            test: /\.tsx?$/,
            include: /src/,
            use: [{ loader: 'ts-loader' }]
        }]
    },
    output: {
        path: path.resolve(__dirname, './dist/renderer'),
        filename: 'renderer.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
}; 