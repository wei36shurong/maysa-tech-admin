import Axios from "axios";
import config from "@/conf/config";

const axios = Axios.create({
    baseURL: config.api
});

function LogicError (message, code, data) {
    this.message = message;
    this.code = code;
    this.data = data;
    this.name = "LogicError";
}

LogicError.prototype = new Error();
LogicError.prototype.constructor = LogicError;
LogicError.prototype.toString = function () {
    return this.name + ":" + this.code + "=>" + this.message;
};

function transData (res) {
    if (!res) {
        throw new LogicError("请求结果为空", "01");
    }
    if (res.responseCode === "00") {
        return res;
    } else {
        throw new LogicError(res.responseMessage, res.responseCode, res);
    }
}

const NetPlugin = function (Vue) {
    async function request (options) {
        // Vue.logger.log("request path", options.path);
        if (typeof options.path === "object") {
            let url = options.url;
            if (!url) {
                throw new LogicError("请求的地址不存在", "601", "");
            }
            for (const key in options.path) {
                const val = options.path[key];
                url = url.replace(":" + key, val);
            }
            options.url = url;
        }
        if (options.params) {
            const keys = Object.keys(options.params);
            for (let index = 0; index < keys.length; index += 1) {
                const val = options.params[keys[index]];
                if (typeof val === "string") {
                    options.params[keys[index]] = val.trim();
                }
            }
        }
        // 对apizz的接口取消withCredentials
        if (options.url && options.url.startsWith(config.mock)) {
            options.withCredentials = false;
        }
        let res = null;
        try {
            res = await axios.request(options);
        } catch (err) {
            Vue.logger.log(`request fail => ${options.url}`, options, res);
            throw new LogicError("网络请求错误", "602", err);
        }
        // options.url 为空时，options本身就是url
        Vue.logger.log(`request success => ${options.url || options}`, options, res);

        return new Promise((resolve, reject) => {
            try {
                const respone = transData(res.data);
                return resolve(respone);
            } catch (err) {
                reject(err);
            }
        });
    }

    // 1. 添加全局方法或属性
    Vue.request = request;

    // 4. 添加实例方法
    Vue.prototype.$request = request;
};

export default NetPlugin;
