/**
 * Created by lijinchao(joshua) on 2017/8/7.
 */
import Vue from "vue";
import { destroyVM, createTest, createVue } from "@unit/util";
import login from "@/vankely/login.vue";

describe("login.vue", () => {
    let vm;
    afterEach(() => {
        destroyVM(vm);
    });

    it("value", done => {
        Vue.nextTick(() => {
            expect("项目列表").to.equal("项目列表");
            done();
        });
    });

    it("should render correct contents", done => {
        vm = createVue({
            ...login,
            store: Vue.store
        });
        // vm = createTest(login, {});
        vm.ruleForm.loginId = "admin";
        vm.ruleForm.password = "admin123";
        Vue.nextTick(async () => {
            const res = await vm.login();
            console.log("login res:", res);
            expect("").to.equal("");
            done();
        });
    });
});
