// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

var webpackConfig = require("../../build/webpack.test.conf");

// process.env.PHANTOMJS_BIN = './node_modules/.bin/phantomjs';

module.exports = function (config) {
    config.set({
        // to run in additional browsers:
        // 1. install corresponding karma launcher
        //    http://karma-runner.github.io/0.13/config/browsers.html
        // 2. add it to the `browsers` array below.
        client: {
            mocha: {
                timeout: 10000 // 6 seconds - upped from 2 seconds
            }
        },
        plugins: [
            "karma-mocha",
            "karma-sinon-chai",
            "karma-phantomjs-shim",

            "karma-webpack",
            "karma-sourcemap-loader",
            "karma-coverage",
            "karma-spec-reporter",
            "karma-phantomjs-launcher"
        ],
        browsers: ["PhantomJS"],
        frameworks: ["mocha", "sinon-chai", "phantomjs-shim"],
        reporters: ["spec", "coverage"],
        files: [
            "http://gosspublic.alicdn.com/aliyun-oss-sdk-4.4.4.min.js",
            "http://libs.baidu.com/jquery/1.10.2/jquery.min.js",
            "http://thenewwork.oss-cn-shanghai.aliyuncs.com/vankely_admin_web/res/jquery.printarea.js",
            "../../node_modules/babel-polyfill/dist/polyfill.js",
            "./index.js"
        ],
        preprocessors: {
            "./index.js": ["webpack", "sourcemap"]
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },
        coverageReporter: {
            dir: "./coverage",
            reporters: [
                { type: "lcov", subdir: "." },
                { type: "text-summary" }
            ]
        }
    });
};
