const path = require('path');
const assetPath = require('./src/services/asset_path');

module.exports = {
    mode: 'production',
    entry: {
        setup: './src/public/app/setup.ts',
        mobile: './src/public/app/mobile.js',
        desktop: './src/public/app/desktop.js',
    },
    output: {
        publicPath: `${assetPath}/app-dist/`,
        path: path.resolve(__dirname, 'src/public/app-dist'),
        filename: '[name].js',
    },
    devtool: 'source-map',
    target: 'electron-renderer',
};
