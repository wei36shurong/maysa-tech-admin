/*eslint no-console: 0 */

const express = require("express");
const webpack = require("webpack");
const proxyMiddleware = require("http-proxy-middleware");
const appConfig = require("../app.config");
const webpackConfig = require("./webpack.config");
const opn = require("opn");
const fs = require("fs-extra");
const utils = require("../utils");

const app = express();
const compiler = webpack(webpackConfig);
const port = appConfig.devServer.port;
const devMiddleware = require("webpack-dev-middleware")(compiler, {
    publicPath: "/",
    stats: appConfig.statsConfig
});
const hotMiddleware = require("webpack-hot-middleware")(compiler, {
    noInfo: false,
    lazy: false,
    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    }
});

compiler.plugin("compilation", (compilation) => {
    compilation.plugin("html-webpack-plugin-after-emit", (data, cb) => {
        hotMiddleware.publish({ action: "reload" });
        cb();
    });
});

app.use(require("connect-history-api-fallback")());
app.use(devMiddleware);
app.use(hotMiddleware);
app.use("/", express.static(utils.resolve("static")));
app.get("*", express.static(utils.resolve("public")));

devMiddleware.waitUntilValid(() => {
    console.log(`> Listening at http://127.0.0.1:${port}\n`.verbose);
});

module.exports = app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    fs.copy(
        utils.resolve("build/dll/dev.html"),
        utils.resolve("public/index.html")
    );
    console.log(`Listening at http://0.0.0.0:${appConfig.devServer.port}/`);
    opn(`http://127.0.0.1:${port}`);
});
