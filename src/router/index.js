import Vue from "vue";
import store from "@/store";
import Router from "vue-router";
// import Orders from "@/components/Orders";
// import Products from "@/components/Products";
// import Engineers from "@/components/Engineers";
// import Solutions from "@/components/Solutions";
// import Communities from "@/components/Communities";

Vue.use(Router);

// 这里breadbrumb的链接不支持动态值的传（eg. :communityId)，
// 需要依赖store里的currentCommunityId, 后期看有没有更好的方法

const communitiesRoute = {
    path: "communities",
    meta: {
        isBreadcrumb: true,
        breadcrumbText: "小区列表"
    },
    component: {
        template: "<router-view />"
    },
    children: [{
        path: "",
        component: (resolve) => require(["@/components/Communities"], resolve)
    }, {
        path: ":communityId/buildings",
        meta: {
            isBreadcrumb: true,
            breadcrumbItem: "currentCommunity",
            formatter: item => item.communityName
        },
        props: true,
        component: { template: "<router-view />" },
        children: [{
            path: "",
            component: (resolve) => require(["@/components/Buildings"], resolve)
        }, {
            path: ":buildingId/rooms",
            meta: {
                isBreadcrumb: true,
                breadcrumbItem: "currentBuilding",
                formatter: item => item.buildingName
            },
            props: true,
            component: (resolve) => require(["@/components/Rooms"], resolve)
        }]
    }]
};
const locationsRoute = {
    path: "locations",
    component: {
        template: `
            <router-view />
        `,
        name: "Location"
    },
    meta: {
        isBreadcrumb: true,
        breadcrumbText: "位置列表"
    },
    children: [{
        path: "",
        component: (resolve) => require(["@/components/Locations"], resolve)
    }, {
        path: ":locationId/products",
        props: true,
        meta: {
            isBreadcrumb: true,
            breadcrumbItem: "currentLocation",
            formatter: item => item.locationName
        },
        component: (resolve) => require(["@/components/Products"], resolve)
    }]
};

const router = new Router({
    routes: [
        {
            path: "/",
            redirect: "/admin"
        },
        {
            path: "/login",
            component: (resolve) => require(["@/vankely/login.vue"], resolve)
        },
        {
            path: "/admin",
            redirect: "/admin/orders",
            component: (resolve) => require(["@/vankely/layout.vue"], resolve),
            children: [
                {
                    path: "orders",
                    component: (resolve) => require(["@/components/Orders"], resolve)
                }, {
                    path: "engineers",
                    component: (resolve) => require(["@/components/Engineers"], resolve)
                }, {
                    path: "residents",
                    component: (resolve) => require(["@/components/Residents"], resolve)
                }, {
                    path: "solutions",
                    component: (resolve) => require(["@/components/Solutions"], resolve)
                },
                locationsRoute,
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
    const isLogin = store.state.isLogin;
    // const isLogin = true;
    document.body.scrollTop = 0;
    Vue.logger.log("from to =>", from.path, to.path, isLogin);
    if (isLogin) {
        if (to.path === "/login") {
            next("/admin");
        } else {
            next();
        }
        // next();
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
