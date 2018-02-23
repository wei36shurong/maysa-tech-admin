/**
 * Created by vyouyou on 17-8-4.
 */

import "babel-polyfill";
// import "babel-runtime";
import Vue from "vue";
import ElementUI from "element-ui";
// import "element-ui/lib/theme-default/index.css";

Vue.use(ElementUI);

import AsyncComputed from "vue-async-computed";
Vue.use(AsyncComputed);

import NetPlugin from "@/plugin/net";
Vue.use(NetPlugin);

// import VueBreadcrumbs from "vue-breadcrumbs";
// Vue.use(VueBreadcrumbs);

import Vuedals, {Component as Vuedal, Bus as VuedalsBus} from "vuedals";
Vue.use(Vuedals);
Vue.component("vuedals", Vuedal);

import logger from "@/util/logger";
import api from "@/conf/api";
import * as constants from "@/conf/constants";
import cache from "@/util/cache";
import utils from "@/util/utils";
import debounce from "throttle-debounce/debounce";
import moment from "moment";

import MyVuetable from "@/components/MyVuetable";
import WInput from "@/components/WInput";
import WButton from "@/components/WButton";
import DynamicBreadcrumbItem from "@/components/DynamicBreadcrumbItem";

const components = [MyVuetable, WInput, WButton, DynamicBreadcrumbItem];

components.forEach(component => {
    console.log("component.name", component.name);
    Vue.component(component.name, component);
});

window.moment = moment;
const install = function (VueClass, opts = {}) {
    /* istanbul ignore if */

    //method
    VueClass.utils = utils;
    VueClass.prototype.$utils = utils;

    VueClass.logger = logger;
    VueClass.prototype.$logger = logger;

    VueClass.api = api;
    VueClass.prototype.$api = api;

    VueClass.constants = constants;
    VueClass.prototype.$constants = constants;

    VueClass.cache = cache;
    VueClass.prototype.$cache = cache;

    const deb = (...args) => {
        if (args.length === 2) {
            return debounce.call(this, args[1], args[0]);
        } else {
            return debounce.call(this, 300, args[0]);
        }
    };
    VueClass.debounce = deb;
    VueClass.prototype.$debounce = deb;
};

Vue.use(install);

import store from "@/store";
import router from "@/router";

Vue.store = store;
Vue.router = router;

import Axios from "axios";
Axios.defaults.withCredentials = true;

export default { store, router };
