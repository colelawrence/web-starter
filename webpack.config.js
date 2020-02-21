// @ts-check
/* eslint-disable */

const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const USE_SOURCEMAPS = true

/** @param {string[]} seg */
const root = (...seg) => path.resolve(__dirname, ...seg)

const isDev = true

/** @type {import("webpack").Configuration} */
module.exports = {
  entry: './src/bootstrap.tsx',
  mode: isDev ? 'development' : 'production',
  output: {
    filename: './main.js',
    // webpack has the ability to generate path info in the output bundle. However, this puts garbage collection pressure on projects that bundle thousands of modules.
    pathinfo: false,
    devtoolModuleFilenameTemplate: 'source://[namespace]/[resource-path]?[loaders]',
  },
  plugins: [
    new MonacoWebpackPlugin({ languages: [], features: [] }),
    new HtmlWebpackPlugin({
      template: root('src/index.html'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
            experimentalWatchApi: isDev,
            compilerOptions: {
              sourceMap: USE_SOURCEMAPS,
              baseUrl: root(),
            },
          },
        },
        include: [root('src')],
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
            experimentalWatchApi: isDev,
            compilerOptions: {
              sourceMap: USE_SOURCEMAPS,
              baseUrl: root(),
            },
          },
        },
        include: [root('src')],
      }, {
        test: /\.ttf$/,
        use: [require.resolve('file-loader')],
        include: [root('node_modules/monaco-editor')],
      }, {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          require.resolve('css-loader'),
        ],
        include: [root('node_modules/monaco-editor')],
      },
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          require.resolve('css-loader'), {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
              ],
            },
          },
        ],
        include: [root('src/index.css')],
      },
    ],
  },
  devtool: isDev
    ? USE_SOURCEMAPS
      ? 'cheap-module-eval-source-map'
      : 'eval'
    : 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    // @ts-ignore
    plugins: [new TsconfigPathsPlugin({ configFile: root('tsconfig.json') })],
  },
  devServer: {
    contentBase: root('dist'),
    hot: true,
  },
  optimization: isDev
    ? undefined
    : {
      concatenateModules: true,
      minimize: true,
      removeEmptyChunks: true,
      usedExports: true,
    },
}
