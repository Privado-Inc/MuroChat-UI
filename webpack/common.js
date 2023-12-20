const HtmlWebPackPlugin = require("html-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const path = require("path");

const LoaderRules = require("./rules");
const supportedExtension = require("./supportedExtension.json");

let fileName = "env.js";
if (process.env.NODE_ENV === "dev") {
    fileName = "env.qa.js";
}

const config = () => ({
    entry: {
        main: "./src/start.tsx"
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            maxInitialRequests: Infinity,
            minSize: 10000,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]highlight.js/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `pkg.${packageName.replace("@", "")}`;
                    }
                }
            }
        }
    },
    output: {
        publicPath: "/",
        filename: "[name].[hash].js",
        path: path.resolve(__dirname, "../build")
    },
    resolve: {
        extensions: supportedExtension,
        alias: {
            app: path.resolve(__dirname, "../src/app/"),
            assets: path.resolve(__dirname, "../src/assets/"),
            hooks: path.resolve(__dirname, "../src/hooks/"),
            components: path.resolve(__dirname, "../src/components/"),
            services: path.resolve(__dirname, "../src/services/"),
            uiLibrary: path.resolve(__dirname, "../src/uiLibrary/"),
            utils: path.resolve(__dirname, "../src/utils/"),
            modules: path.resolve(__dirname, "../src/modules/")
        }
    },
    module: {
        rules: LoaderRules
    },
    plugins: [
        new ProgressBarPlugin({}),
        new HtmlWebPackPlugin({
            template: "./public/index.ejs",
            filename: "./index.html",
            favicon: "./public/favicon.png",
            chunks: ["main"],
            hash: true,
            templateParameters: {
                envScript: `<script type="text/javascript" src="/${fileName}"></script>`
            }
        })
    ]
});

module.exports = config;
