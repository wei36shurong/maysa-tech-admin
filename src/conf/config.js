const config = {
    base: {
        mock: "http://127.0.0.1:8080",
        // 这里json是当root用的
        // json: "http://127.0.0.1:8080",
        // json: "http://172.17.21.221:8088/admin",
        api: "http://111.231.142.117:8088/admin"
    },
    testing: {
        api: "http://127.0.0.1:8081"
    },
    local: {
        api: "http://127.0.0.1:8081"
    },
    development: {
        api: "http://127.0.0.1:8081"
    },
    alpha: {
        api: "http://127.0.0.1:8081"
    },
    beta: {
        api: "http://127.0.0.1:8081"
    },
    production: {
        api: "http://127.0.0.1:8081"
    }
};
// export default Object.assign(config.base, config[process.env.PACK_ENV]);
export default Object.assign(config.base);
