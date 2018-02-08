import Vue from "vue";
import store from "@/store";
import Router from "vue-router";
import Orders from "@/components/Orders";
import Products from "@/components/Products";
import Engineers from "@/components/Engineers";
import Solutions from "@/components/Solutions";
import Communities from "@/components/Communities";

Vue.use(Router);

import { CacheKeys } from "@/conf/constants";

// 这里breadbrumb的链接不支持动态值的传（eg. :communityId)，
// 需要依赖store里的currentCommunityId, 后期看有没有更好的方法

const communitiesRoot = "/admin/community-layout/communities";
const buildingsPath = `${communitiesRoot}/:communityId/buildings`;
const roomsPath = `${buildingsPath}/:buildingId/rooms`;
const communitiesRoute = {
    path: "community-layout",
    alias: "communities",
    redirect: "community-layout/communities",
    meta: { breadcrumb: "小区列表" },
    component: (resolve) => require(["@/components/CommunityLayout"], resolve),
    children: [{
        path: "",
        component: (resolve) => require(["@/components/Communities"], resolve)
    }, {
        path: "communities/:communityId",
        redirect: buildingsPath,
        meta: { breadcrumb: "楼栋列表" },
        component: { template: "<router-view />" },
        children: [{
            path: buildingsPath,
            props: true,
            component: (resolve) => require(["@/components/Buildings"], resolve)
        }, {
            path: ":buildingId",
            redirect: roomsPath,
            meta: { breadcrumb: "房间列表" },
            component: { template: "<router-view />" },
            children: [{
                path: roomsPath,
                props: true,
                component: (resolve) => require(["@/components/Rooms"], resolve)
            }]
        }]
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
                    component: (resolve) => require(["@/vankely/demo/index.vue"], resolve)
                }, {
                    path: "orders",
                    component: (resolve) => require(["@/components/Orders"], resolve)
                }, {
                    path: "products",
                    component: (resolve) => require(["@/components/Products"], resolve)
                }, {
                    path: "engineers",
                    component: (resolve) => require(["@/components/Engineers"], resolve)
                }, {
                    path: "solutions",
                    component: (resolve) => require(["@/components/Solutions"], resolve)
                },
                communitiesRoute
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
