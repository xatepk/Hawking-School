const path = require('path');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PugPlugin = require('pug-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
  mode,
  devtool,
  entry: path.resolve(__dirname, 'src', 'js', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash:8].js',
    clean: true,
    assetModuleFilename: '[name].[contenthash:8][ext]',
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    open: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
            ],
          },
        },
      },
      {
        test: /\.pug$/,
        loader: PugPlugin.loader
      },
      {
        test: /\.(png|svg|webp|jpe?g|gif|woff|woff2|ttf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.less$/i,
        use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'dev', 'index.pug'),
      filename: 'index.html',
    }),
    // new PugPlugin({
    //   pretty: true,
    //   extractCss: {
    //     filename: 'assets/css/[name].[contenthash:8].css'
    //   }
    // }),
    !devMode && new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
  ].filter(Boolean),
  optimization: {
    minimizer: [
      !devMode && new CssMinimizerPlugin(),
    ].filter(Boolean),
  },
};
