const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

class ForkTsCheckerWebpackPluginIssuePrioritizer {
    constructor(enable) {
        this.enable = enable;
    }
    apply(compiler) {
        const hooks = ForkTsCheckerWebpackPlugin.getCompilerHooks(compiler);
        hooks.issues.tap("fetch-issues-ts-checker", (issues) => {
            // do whatever you want with your issues
            const errors = issues.filter((a) => a.severity == "error");
            const others = issues.filter((a) => a.severity !== "error");
            return others.concat(errors);
        });
    }
}

module.exports = ForkTsCheckerWebpackPluginIssuePrioritizer;
