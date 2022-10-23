const path = require('path');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PugPlugin = require('pug-plugin');
const  SpriteLoaderPlugin  =  require ( 'svg-sprite-loader/plugin' ) ;

const glob = require('glob').sync;
const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
  mode,
  devtool,
  entry: {
    main: path.resolve(__dirname, 'src', 'js', 'index.js'),
    sprite: glob(path.resolve(__dirname, 'src/img/icons/*.svg')),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash:8].js',
    clean: true,
    assetModuleFilename: '[name].[contenthash:8][ext]',
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    // open: true,
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
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: path.resolve(__dirname, 'src/img/icons'),
        options: {
          extract: true,
          spriteFilename: 'icons.svg',
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.less$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'dev', 'index.pug'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash:8].css',
    }),
    new SpriteLoaderPlugin(),
  ].filter(Boolean),
  optimization: {
    minimizer: [
      !devMode && new CssMinimizerPlugin(),
    ].filter(Boolean),
  },
};
