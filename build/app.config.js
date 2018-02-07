const utils = require("./utils");

const baseCdnPrefix = "vankely-admin";
const cdnPath = "cdn-vankely-admin";
const oss = {
    region: "xxx",
    bucket: "xx",
    accessKeyId: "xxx",
    accessKeySecret: "xxxx"
};

module.exports = {
    // 基本的应用配置信息
    apps: [{
        id: "index",
        src: utils.resolve("src/main.js"),
        indexPage: utils.resolve("src/index.html"),
        compiled: true
    }],

    // 开发入口配置
    devServer: {
        appEntrySrc: utils.resolve("src/main.js"), //当前待调试的APP的入口文件
        port: 8080 //监听的Server端口
    },

    // 依赖项配置
    proxy: {
        //后端服务器地址 http://your.backend/
        // '/api/*': 'http://localhost:3001'
    },

    // 后端 api 配置，这样配置可以避免将测试服务器端口暴露出去
    api: {
        dev: {},
        prod: {}
    },

    defaultConfig: {
        oss: oss
    },
    development: {
        assetsPublicPath: "/",
        cndPrefix: `${baseCdnPrefix}-dev`
    },
    alpha: {
        assetsPublicPath: "/",
        cndPrefix: `${baseCdnPrefix}-alpha`
    },
    beta: {
        assetsPublicPath: "/",
        cndPrefix: `${baseCdnPrefix}-beta`
    },
    production: {
        assetsPublicPath: "/",
        cndPrefix: `${baseCdnPrefix}-pro`
    }
};

module.exports.config = Object.assign(module.exports.defaultConfig, module.exports[process.env.PACK_ENV || "development"]);
