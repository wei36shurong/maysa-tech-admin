/**
 * Created by lijinchao(joshua) on 2017/8/7.
 */
import Vue from "vue";
import unfinished from "@/vankely/unfinished.vue";

describe("unfinished.vue", () => {
    it("should render correct contents", () => {
        const Constructor = Vue.extend(unfinished);
        const vm = new Constructor().$mount();
        expect(vm.$el.textContent.trim()).to.equal("页面未完成");
    });
});
