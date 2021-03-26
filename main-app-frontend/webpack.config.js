const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        index: './src/index.js',
        download: './src/download.js',
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        open: false,
        host: 'localhost',
        port: 8081,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(png|jpg|ico)$/,
                loader: 'url-loader'
            },
            {
                test: /\.svg/,
                use: {
                    loader: "svg-url-loader",
                    options: {
                        iesafe: true,
                    },
                },
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: '!!raw-loader!./src/index.ejs',
            filename: 'index.html',
            chunks: ['index'],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            template: '!!raw-loader!./src/download.ejs',
            filename: 'download.html',
            chunks: ['download'],
            minify: false,
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css'
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/images", to: "images/" },
                { from: "./src/favicon.ico" }
            ],
        }),
        new Dotenv({
            path: './.env',
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({
                exclude: /(node_modules)/,
            }),
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2
                    },
                    safari10: false,
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true
                    }
                },
                parallel: true,
            })
        ],
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`,
        },
    },
    output: {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
};
