const { merge } = require("webpack-merge");
const baseConfig = require("./common");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

module.exports = [
    merge(baseConfig(), {
        mode: "production"
    })
];
