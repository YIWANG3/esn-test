const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');

module.exports = {
    mode: 'production',
    entry: {
        app: './client/index.js'
    },
    devtool: 'inline-source-map',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'ESN',
            template: 'index.html',
            favicon: './favicon.ico'
        }),
        new HappyPack({
            cache: true,
            loaders: [{
                loader: 'babel-loader'
            }]
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                loaders: ['happypack/loader']
            },
            {
                test: /\.(js)$/,
                exclude: [/node_modules/, /dist/],
                use: ['babel-loader', 'eslint-loader']
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(less)$/,
                use: [
                    {
                        loader: 'style-loader'
                    }, {
                        loader: 'css-loader'
                    }, {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
};
