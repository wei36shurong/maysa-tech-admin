import api from "@/conf/api.js";
import OSS from "OSS";
import Vue from "vue";
import { CacheKeys } from "@/conf/constants";

const BUCKET = "xx";
const REGION = "xxx";
const URL_PREFIX = "xxx";

export default {
    client: {},

    init: async function () {
        let token = Vue.cache.cacheGet(CacheKeys.aliossToken);
        if (!token) {
            // use cache
            const res = await Vue.request({
                url: api.oss_token,
                method: "post"
            });
            Vue.logger.log("init", res);
            token = res.data;
            Vue.cache.cacheSet(CacheKeys.aliossToken, token, 1800 * 1000);
        }
        const option = {
            accessKeyId: token.credentials.accessKeyId,
            accessKeySecret: token.credentials.accessKeySecret,
            stsToken: token.credentials.securityToken,
            bucket: BUCKET,
            region: REGION
        };
        this.client = new OSS.Wrapper(option);
    },

    getRandomFileName (len) {
        len = len || 32;
        const $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
        /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        const maxPos = $chars.length;
        let pwd = "";
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },

    async putObject (file) {
        await this.init();

        Vue.store.dispatch("fullscreenLoading", "文件上传中");
        const fileName = URL_PREFIX + this.getRandomFileName(12) + "/" + file.name;
        return this.client.multipartUpload(fileName, file, {
            progress: function (p) {
                return function (done) {
                    // 小数点
                    const round = function (v, e) {
                        let t = 1;
                        for (; e > 0; t *= 10, e--) ;
                        for (; e < 0; t /= 10, e++) ;
                        return Math.round(v * t) / t;
                    };
                    done();
                };
            }
        }).then((res) => {
            Vue.store.dispatch("fullscreenLoading", false);
            // 当图片过大时候，会自动分段上传
            if (res.url === undefined) {
                const url = res.res.requestUrls[0].split("?")[0];
                const obj = {
                    name: res.name,
                    url: url,
                    source_name: file.name
                };
                return obj;
            }
            res.source_name = file.name;
            return res;
        }).catch((err) => {
            /*eslint no-console: 0*/
            console.log("err:", err);
        });
    }
};
