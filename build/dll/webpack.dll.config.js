const path = require("path");
const pkg = require("../../package.json");
const webpack = require("webpack");
const utils = require("./../utils");

const dllConfig = {
    name: "vendor",
    entry: Object.keys(pkg.dependencies),
    output: {
        path: utils.resolve("public/dll"),
        filename: "vendor.bundle.js",
        library: "vendor_[hash]"
    },
    plugins: [
        new webpack.DllPlugin({
            name: "vendor_[hash]",
            path: utils.resolve("public/dll/manifest.json")
        })
    ]
};

module.exports = dllConfig;
