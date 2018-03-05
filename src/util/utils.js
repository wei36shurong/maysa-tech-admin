export const patten = {
    // 英文字符
    "eng": /^[a-zA-Z]{5,20}$/,
    // 邮箱
    "email": /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    // 数字
    "num": /^[0-9]{5,20}$/,
    // 浮点数
    "float": /^[0-9]+[\.]{0,1}[0-9]*$/,
    // 英文字母和数字
    "engnum": /^[a-zA-Z0-9]{5,20}$/,
    // 手机
    "phone": /^[1][3|4|5|7|8][0-9]{9}$/,
    // 中文
    "chinese": /^[\u4e00-\u9fa5]$/,
    // 密码
    "password": /^[a-zA-Z0-9]{6,19}$/,
    "password_back": /^[a-zA-Z]+(?=[0-9]+)$|^[0-9]+(?=[a-zA-Z]+)$/,
    // 特殊字符
    "special": /[`~!@#\$%\^\&\*\(\)_\+<>\?:\"\{\},\.\\\/;'\[\]]+/,
    //纳税人识别号18号
    "idenfifyNumber": /[0-9a-zA-Z]{18}/
};
import moment from "moment";

const funcs = {
    fullScreen () {
        const docElm = document.documentElement;
        //W3C
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    },
    exitFullscreen () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    },

    browser () {
        const ua = window.navigator.userAgent;
        if (/Firefox/g.test(ua)) {
            return "Firefox";
        } else if (/MSIE/g.test(ua)) {
            return "IE";
        } else if (/Opera/g.test(ua)) {
            return "Opera";
        } else if (/Chrome/g.test(ua)) {
            return "Chrome";
        } else if (/^apple\s+/i.test(navigator.vendor)) {
            return "Safair";
        } else {
            return "未知浏览器";
        }
    },

    isArray (arr) {
        return Object.prototype.toString.call(arr) === "[object Array]";
    },
    getDefaultVal (val) {
        if (this.isArray(val)) {
            return val;
        }
        if (val === "" || val === null || val === undefined) {
            return "--";
        }
        return val;
    },
    getDefaultValByObj (obj) {
        for (const key in obj) {
            obj[key] = this.getDefaultVal(obj[key]);
        }
        return obj;
    },
    getDefaultValByList (list) {
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            list[i] = this.getDefaultValByObj(item);
        }
        return list;
    },
    patten (value, express = "eng") {
        switch (express) {
            case "eng":
                return this.pattenEng(value);
            case "email":
                return this.pattenEmail(value);
            case "num":
                return this.pattenNum(value);
            case "float":
                return this.pattenFloat(value);
            case "engNum":
                return this.pattenEngNum(value);
            case "phone":
                return this.pattenPhone(value);
            case "chinese":
                return this.pattenChinese(value);
            case "special":
                return this.pattenSpecial(value);
            default:
                return false;
        }
    },
    pattenEng (value) {
        return patten.eng.test(value);
    },
    pattenEmail (value) {
        return patten.email.test(value);
    },
    pattenNum (value) {
        return patten.num.test(value);
    },
    pattenFloat (value) {
        return patten.float.test(value);
    },
    pattenEngNum (value) {
        return patten.engnum.test(value);
    },
    pattenPhone (value) {
        return patten.phone.test(value);
    },
    pattenChinese (value) {
        return patten.chinese.test(value);
    },
    pattenPassword (p) {
        // if(patten.password.test(value)){
        //     return value.length <= 20 && value.length >= 6
        // }
        // return false
        if (p.length < 6) {
            return false;
        }
        if (p.length > 20) {
            return false;
        }
        if (p.search(/[a-zA-Z]/i) < 0) {
            return false;
        }
        if (p.search(/[0-9]/) < 0) {
            return false;
        }
        if (p.search(/[^0-9a-zA-Z]/) > -1) {
            return false;
        }
        return true;
    },
    pattenSpecial (value) {
        return patten.special.test(value);
    },

    getMonthDays (date) {
        const curDate = new Date(date);
        /* 将日期设置为1, 避免月份加一后，日期错乱*/
        curDate.setDate(1);
        const curMonth = curDate.getMonth();
        /*  月份加一 */
        curDate.setMonth(curMonth + 1);
        /* 将日期设置为0, 等于1号减一天，也就是这个月的最后一天 */
        curDate.setDate(0);
        /* 返回当月的天数 */
        return curDate.getDate();
    },

    getNextMonthDate (date, cycleMonth) {
        const nextStart = new Date(date);
        nextStart.setMonth(nextStart.getMonth() + cycleMonth);
        if (date.getDate() > 15 && nextStart.getDate() < 15) {
            nextStart.setDate(0);
        }
        return nextStart;
    },

    getLastDayOfYear (date) {
        const nextStart = new Date(date);
        nextStart.setMonth(11);
        nextStart.setDate(31);
        return nextStart;
    },
    getDate(timestamp) {
        return new Date(funcs.getTimestamp(timestamp, 13));
    },
    getTimestamp(date, digitNum = 10) {
        let timestamp = new Date(date).valueOf();
        // 转换成digitNum位数的timestamp
        timestamp *= 10 ** (digitNum - String(timestamp).length);
        return timestamp;
    },
    formatterTime (row, column) {
        return funcs.formatDate(row[column.property], "YYYY-MM-DD HH:mm:ss");
    },
    formatterDate (row, column) {
        return funcs.formatDate(row[column.property], "YYYY-MM-DD");
    },
    formatDate (date, format = "YYYY-MM-DD HH:mm:ss") {
        if (!date) {
            return "";
        }
        if (typeof date === "number") {
            // 获取13位的timestamp
            const timestamp = date * 10 ** (13 - String(date).length);
            date = new Date(timestamp);
        }
        const formatStr = moment(date).format(format);
        return formatStr;
    },
    formatStringToDate (string) {
        if (!string) {
            // 空的string都统一处理成NaN
            return moment("");
        }
        return moment(string);
    },
    // 保留两位小数
    formatFloat2 (num) {
        const number = Number(num);
        if (number) {
            return number.toFixed(2);
        } else {
            return "0.00";
        }
    },
    tableRowClassName (row, index) {
        if (index % 2 === 0) {
            return "white-row";
        } else if (index % 2 === 1) {
            return "black-row";
        }
    },

    validateNonZeroStr (rule, value, callback) {
        if (value && !isNaN(parseFloat(value)) && parseFloat(value) > 0) {
            return callback();
        } else {
            return callback(new Error(rule.message));
        }
    },

    generateUUID (len) {
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

    //oss小图
    normalImage (url) {
        if (url == null) {
            return "";
        }
        // url = url.replace(/https:/g, "http:");
        url = url.replace(/oss-cn-/g, "img-cn-");
        if (url.indexOf("img-cn-") !== -1 && url.indexOf("@") === -1) {
            return url + "@640w_1l";
        }
        return url;
    },

    //oss小小图
    smallImage (url) {
        if (url == null) {
            return "";
        }
        // url = url.replace(/https:/g, "http:");
        url = url.replace(/oss-cn-/g, "img-cn-");
        if (url.indexOf("img-cn-") !== -1) {
            return url + "@480w_1l";
        }
        return url;
    },

    validateNumberStr (rule, value, callback) {
        let checkVal = true;
        if (!value && value !== 0) {
            if (rule.required) {
                checkVal = false;
            }
        } else {
            if (typeof value === "string") {
                if (!(/^\d+(\.\d+)?$/.test(value))) {
                    checkVal = false;
                }
            } else if (typeof value !== "number") {
                checkVal = false;
            }
        }
        if (checkVal) {
            return callback();
        } else {
            return callback(new Error(rule.message));
        }
    },

    // 检测面积后者是否大于前者，出铺面积等
    validateArea (rule, value, callback) {
        if (parseFloat(value[0]) < parseFloat(value[1])) {
            return callback(new Error(rule.message));
        }
        return callback();
    },

    addParamsForUrl (baseUrl, params) {
        let index = 0;
        for (const key in params) {
            if (index === 0) {
                baseUrl += "?";
            } else {
                baseUrl += "&";
            }
            index++;
            const value = params[key] ? params[key] : "";
            baseUrl += key + "=" + value;
        }
        return baseUrl;
    },
    ArrayToString (data, key) {
        const newArray = [];
        data.forEach((item) => {
            newArray.push(item[key]);
        });
        const newString = newArray + "";
        return newString;
    },
    ArrayGetIds (data, key) {
        const newArray = [];
        data.forEach((item) => {
            newArray.push(item[key]);
        });
        return newArray;
    },
    downloadExcel (url) {
        const aLink = document.createElement("a");
        aLink.target = "_self";
        aLink.href = url;
        document.body.appendChild(aLink);
        aLink.click();
        aLink.remove();
    },
    sleep (mils) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, mils);
        });
    },
    toSnakeCase (str) {
        return str.replace(/([A-Z])/g, (upper) => "_" + upper.toLowerCase());
    }
};
export default funcs;
