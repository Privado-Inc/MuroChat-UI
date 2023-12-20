const { merge } = require("webpack-merge");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const MyPluginThatModifiesEmittedIssues = require("./ts-checker-wp-shuffle-issues");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const baseConfig = require("./common");

const config = merge(baseConfig(), {
    // devtool: "eval-cheap-module-source-map",
    devtool: "inline-source-map",
    mode: "development",
    stats: {
        entrypoints: false,
        hash: false,
        timings: false,
        version: false,
        chunks: false,
        children: false,
        moduleTrace: false,
        modules: false,
        outputPath: false,
        source: false,
        preset: "minimal",
        assets: true,
        colors: true,
        builtAt: true
    },
    devServer: {
        // progress: true,
        compress: true,
        port: 4002,
        open: true,
        onListening: function (devServer) {
            const port = devServer.server.address().port;
            console.warn("");
            console.warn("Listening on port:", port);
            console.warn("");
        },
        hot: true,
        historyApiFallback: {
            rewrites: [
                { from: /^\/env\.js/, to: "/env.js" },
                { from: /./, to: "/index.html" }
            ]
        }
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                common: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                    reuseExistingChunk: true
                }
            }
        },
        minimize: false
    },
    plugins: [
        new ReactRefreshWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{ from: "public/envs" }]
        }),
        new CircularDependencyPlugin({
            exclude: /node_modules/
        }),
        new ForkTsCheckerWebpackPlugin({
            formatter: {
                type: "codeframe",
                options: {
                    highlightCode: false,
                    linesAbove: 0,
                    linesBelow: 0,
                    forceColor: true
                }
            },
            typescript: {
                memoryLimit: 2048,
                diagnosticOptions: {
                    semantic: true
                    // syntactic: true
                },
                mode: "write-references"
            }
        }),
        new MyPluginThatModifiesEmittedIssues()
    ]
});

module.exports = config;
