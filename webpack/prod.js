const { merge } = require("webpack-merge");
const baseConfig = require("./common");

module.exports = [
    merge(baseConfig(), {
        mode: "production"
    })
];
