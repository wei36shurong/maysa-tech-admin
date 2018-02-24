// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from "vue";
import store from "@/store";
// eslint-disable-next-line no-unused-vars
import init from "@/init";
import router from "@/router";

import App from "@/App";

const renderVue = () => {
    Vue.logger.log("renderVue");
    /* eslint-disable no-new */
    const vm = new Vue({
        el: "#app",
        router,
        store,
        template: "<App/>",
        components: { App }
    });
    Vue.vm = vm;
};

store.dispatch("init").then(data => {
    Vue.logger.log("dispatch init data", data);
    if (!data.isLogin) {
        // vm.$router.push("/login");
        const path = window.location.pathname;
        if (path !== "" && path.indexOf("/login") === 0) {
            return;
        }
        if (path === "/") {
            return;
        }
        Vue.logger.log("user not login ", path);
        store.dispatch("redirectLogin", path);
    } else {
        Vue.logger.log("user logined");
    }
}).then(() => {
    renderVue();
}).catch(error => {
    Vue.logger.error("dispatch init error", error);
    renderVue();
});
window.Vue = Vue;
