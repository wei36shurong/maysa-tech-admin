// @flow

const webpack = require("webpack");
const path = require("path");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");

//判断当前是否处于开发状态下
const __DEV__ = (process.env.NODE_ENV || "development") === "development";
function resolve (dir) {
    return path.join(__dirname, "../..", dir);
}

// 通用插件组
exports.commonPlugins = [
    // 定义环境变量
    new webpack.DefinePlugin({
        // 这里将 Node 中使用的变量也传入到 Web 环境中，以方便使用
        "process.env": {
            //因为使用热加载，所以在开发状态下可能传入的环境变量为空
            NODE_ENV: JSON.stringify(__DEV__ ? "development" : "production"),
            PACK_ENV: JSON.stringify(process.env.PACK_ENV || "development")
        },
        // 判断当前是否处于开发状态
        __DEV__: JSON.stringify(__DEV__)
    })
];

//开发时使用插件
exports.devPlugins = [

    // 启用 HMR
    new webpack.HotModuleReplacementPlugin(),

    // 在控制台中输出可读的模块名
    // new webpack.NamedModulesPlugin(),

    // 避免发出包含错误的模块
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
        minimize: false,
        debug: true,
        options: {
            context: "/"
        }
    }),
    new FriendlyErrorsPlugin(),
    new webpack.DllReferencePlugin({
        manifest: resolve("public/dll/manifest.json")
    })
];
