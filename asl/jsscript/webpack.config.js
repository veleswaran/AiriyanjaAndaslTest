const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
    const isDev = env.development === true;
    const version = (process.env.APP_VERSION ? process.env.APP_VERSION : 'noversion').replace(".", "_");
    const buildPath = isDev ? './dist' : './dist';
    const prodScript = (env.prodScript === true || !isDev);
    if (!isDev) {
        return [
            {
                mode: 'production',
                devtool: false,
                entry: prodScript ? './js/app.js' : './js/app_test.js',
                output: {
                    publicPath: `https://asl.airiyan.in/dist/${version}/`,
                    filename: 'asl.js',
                    path: path.resolve(__dirname, buildPath),
                },
                module: {
                    rules: [
                        {
                            test: /\.(js|jsx)$/,
                            exclude: /node_modules/,
                            use: {
                                loader: "babel-loader"
                            }
                        },
                        {
                            test: /\.css$/i,
                            sideEffects: true,
                            use: ['style-loader', 'css-loader']
                        }
                    ]
                },
                plugins: [
                    new ModuleFederationPlugin({
                        name: 'asl',
                        filename: 'aslEntry.js',
                        exposes: {
                            './app': './js/app.js', // adjust path as needed
                        },
                        shared: {
                            react: { singleton: true, eager: true, requiredVersion: "^19.1.1" },
                            'react-dom': { singleton: true, eager: true, requiredVersion: "^19.1.1" },
                            bootstrap: { singleton: true, eager: true },
                            'bootstrap-icons': { singleton: true, eager: true },
                            'react-bootstrap': { singleton: true, eager: true },
                            'react-bootstrap-icons': { singleton: true, eager: true }
                        }
                    })
                ],
                optimization: {
                    minimize: true,
                    minimizer: [
                        `...`, // keeps existing JS minimizers like Terser
                        new CssMinimizerPlugin(), // this minifies CSS
                    ],
                },
                resolve: {
                    extensions: [".js", ".jsx", '.css']
                }
            }
        ];

    }
    // config for testing
    return [
        {
            mode: 'production',
            devtool: false,
            entry: prodScript ? './js/app.js' : './js/app_test.js',
            output: {
                filename: 'asl.js',
                path: path.resolve(__dirname, buildPath),
                publicPath: 'auto',
                clean: true
            },
            module: {
                rules: [
                    {
                        test: /\.(js|jsx)$/,
                        exclude: /node_modules/,
                        use: {
                            loader: "babel-loader"
                        }
                    },
                    {
                        test: /\.css$/i,
                        sideEffects: true,
                        use: [MiniCssExtractPlugin.loader, 'css-loader']
                    }
                ]
            },
            plugins: [
                new MiniCssExtractPlugin({
                    filename: "asl.css"
                }),
                new ModuleFederationPlugin({
                    name: 'asl',
                    filename: 'aslEntry.js',
                    exposes: {
                        './app': './js/app.js',
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
                    filename: "./index.html",      // relative to output.path
                })
            ],
            optimization: {
                minimize: true,
                minimizer: [
                    `...`, // keeps existing JS minimizers like Terser
                    new CssMinimizerPlugin(), // this minifies CSS
                ],
            },
            resolve: {
                extensions: [".js", ".jsx", '.css']
            },
            stats: {
                all: false,
                errors: true,
                warnings: false
            },
            performance: {
                hints: false, // disables size warnings 
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
                port: 3001,
                open: true,
                hot: true,
                liveReload: true,
            }
        }
    ];
};
