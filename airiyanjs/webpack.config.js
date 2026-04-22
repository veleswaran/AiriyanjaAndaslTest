const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

const HtmlWebpackPlugin = require("html-webpack-plugin");

require('dotenv').config();

module.exports = (env) => {
  const isDev = env.development === true;
  const buildPath = isDev ? "dist" : 'dist/script';
  const chunkPublicPath = isDev ? "/" : "/script/"
  const indexFileName = isDev ? "index.html" : "../index.html";
  return {
    cache: {
      type: 'filesystem', // enables persistent caching
    },
    mode: 'production',
    entry: './js/index.js',
    output: {
      path: path.resolve(__dirname, buildPath),
      filename: "[name].[contenthash].js",
      chunkFilename: "[name].[contenthash].js",
      publicPath: chunkPublicPath, // Pointing to the actual folder,
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/i,
          sideEffects: true,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif|svg|json)$/i,
          type: 'asset/resource',   // copies image/files to output folder
        }
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
        chunkFilename: "[id].[contenthash].css",
      }),
      new ModuleFederationPlugin({
        name: 'airiyanApp',
        remotes: {
          asl: `asl@${isDev ? 'http://localhost:3001/aslEntry.js' : 'https://asl.airiyan.in/dist/1_0/aslEntry.js'}`,
        },
        shared: {
          react: { singleton: true, eager: true, requiredVersion: "^19.1.1" },
          'react-dom': { singleton: true, eager: true, requiredVersion: "^19.1.1" },
          bootstrap: { singleton: true, eager: true },
          'bootstrap-icons': { singleton: true, eager: true },
          'react-bootstrap': { singleton: true, eager: true },
          'react-bootstrap-icons': { singleton: true, eager: true }
        }
      }),
      new HtmlWebpackPlugin({
        template: "./test/index.html",
        filename: indexFileName,      // relative to output.path
      })
    ],
    optimization: {
      minimizer: [
        `...`, // keeps existing JS minimizers like Terser
        new CssMinimizerPlugin(), // this minifies CSS
      ],
      splitChunks: {
        maxSize: 200000,
        chunks: "all",
        cacheGroups: {
          r: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
            name: 'r',
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
          },
          bs: {
            test: /[\\/]node_modules[\\/](bootstrap|bootstrap-icons)[\\/]/,
            name: 'bs',
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
          },
          rbs: {
            test: /[\\/]node_modules[\\/](react-bootstrap)[\\/]/,
            name: 'rbs',
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
          },
          rbsic: {
            test: /[\\/]node_modules[\\/](react-bootstrap-icons)[\\/]/,
            name: 'rbsic',
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
          },
          others: {
            test: /[\\/]node_modules[\\/]/,
            name: 'others', // Or whatever name you expect
            chunks: 'all', // Or 'initial'
            priority: -10,
            reuseExistingChunk: true
          },
        }
      },
      runtimeChunk: "multiple"
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      historyApiFallback: {
        index: '/index.html', // The path to your index.html
        disableDotRule: true, // Optional: Prevents fallback for paths containing a dot (e.g., file extensions)
      },
      compress: true,
      port: 3000,
      open: true,
      hot: true,
      liveReload: false,
      proxy: [
        {
          context: ['/service'],
          target: process.env.APIURL,
          changeOrigin: true,
          pathRewrite: { '^/service': '' },
          secure: false,
          onProxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('Origin', 'https://airiyan.in');
            proxyReq.setHeader('Cookie', `sessionkey=${process.env.SESSION_KEY}`);// Add you session key here
          }
        }
      ]
    },
    performance: {
      hints: false
    }
  }
};