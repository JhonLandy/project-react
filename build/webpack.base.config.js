const path = require('node:path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const { dist } = require('./common')

module.exports = {
  target: 'web',
  entry: './src/main.tsx', // 单入口
  output: {
    path: path.resolve(__dirname, `../${dist}`),
    filename: './js/[name].[contenthash].js', // 使用[name]打包出来的js文件会分别按照入口文件配置的属性来命名        publicPath: './',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.sass'],
    alias: {
      '@src': path.resolve(__dirname, '../src/'),
      '@views': path.resolve(__dirname, '../src/views/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: process.env.NODE_ENV === 'production'
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
          },
          'css-loader',
        ],
      },
      {
        test: /\.less$/i,
        use: [
          {
            loader: process.env.NODE_ENV === 'production'
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
          },
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        type: 'asset',
        generator: {
          filename: '[name].[ext]',
          outputPath: '/assets/font',
          publicPath: '/assets/font/',
        },
      },
      {
        test: /\.(jpg|png|jpeg|webp|gif)$/,
        type: 'asset',
        generator: {
          filename: '[name].[ext]',
          outputPath: '/assets/img',
          publicPath: '/assets/img/',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 3 * 1024, // 对小体积的资源图片进行管理，小图片转成base64,减少请求数量
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'myWebPackDemo',
      // favicon: './public/favicon.ico',
      template: './public/index.html',
      filename: 'index.html',
      inject: true,
      minify: {
        // 压缩HTML⽂件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空⽩符与换⾏符
        minifyCSS: true, // 压缩内联css
        keepClosingSlash: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new Dotenv({
      path:
                process.env.NODE_ENV === 'production'
                  ? path.join(__dirname, './.env.pro')
                  : path.join(__dirname, './.env.dev'),
      allowEmptyValues: true,
      expand: true,
    }),
  ],
}
