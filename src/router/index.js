import Vue from "vue";
import store from "@/store";
import Router from "vue-router";

Vue.use(Router);

import { CacheKeys } from "@/conf/constants";

const demoRoute = {
    path: "demo",
    component: (resolve) => require(["@/vankely/sub-layout.vue"], resolve),
    children: [{
        path: "index",
        meta: "/admin/demo/index",
        component: (resolve) => require(["@/vankely/demo/index.vue"], resolve)
    }]
};

const router = new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            redirect: "/admin/home"
        },
        {
            path: "/login",
            component: (resolve) => require(["@/vankely/login.vue"], resolve)
        },
        {
            path: "/admin",
            component: (resolve) => require(["@/vankely/layout.vue"], resolve),
            children: [
                {
                    path: "home",
                    // component: (resolve) => require(['@/components/Hello.vue'], resolve)
                    component: (resolve) => require(["@/vankely/demo/index.vue"], resolve)
                },
                demoRoute
            ]
        },
        {
            path: "/:params*",
            component: require("@/components/not_found.vue")
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    // TEST
    // const isLogin = store.state.isLogin;
    const isLogin = true;
    console.log("isLogin", isLogin);
    document.body.scrollTop = 0;
    Vue.logger.log("from to =>", from.path, to.path, isLogin);
    if (isLogin) {
        if (to.path === "/login") {
            next("/admin/home");
        } else {
            Vue.logger.log("route from => to", from, to);
            next();
        }
    } else {
        // 判断是否登录，（可以通过接口，Vuex状态 token）
        // 没有登录走下面逻辑
        if (to.path !== "/login" && to.path !== "/users/password/reset") {
            const redirect = to.path;
            Vue.logger.log("redirect url:", redirect);
            // next("/login?redirect=" + redirect);
            store.dispatch("redirectLogin", redirect);
            next(false);
        } else {
            next();
        }
    }
});

export default router;
