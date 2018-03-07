const config = {
    base: { api: "http://111.231.142.117:8088/admin" },
    testing: { api: "111.231.142.117:8080/admin" },
    local: { api: "http://172.17.21.221:8088" },
    development: { api: "http://172.17.21.221:8088/admin" },
    alpha: { api: "http://127.0.0.1:8081" },
    beta: { api: "http://127.0.0.1:8081" },
    production: { api: "https://product-service-admin.maysatech.com/admin" }
};
export default Object.assign(config.base, config[process.env.PACK_ENV]);
