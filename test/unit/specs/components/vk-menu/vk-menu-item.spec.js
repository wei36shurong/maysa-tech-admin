/**
 * Created by lijinchao(joshua) on 2017/8/7.
 */
import Vue from "vue";
import { destroyVM, createTest, createVue } from "@unit/util";
import vkMenuItem from "@/components/vk-menu/vk-menu-item.vue";

describe("vk-menu-item.vue", () => {
    let vm;
    afterEach(() => {
        destroyVM(vm);
    });

    it("should render correct contents", done => {
        vm = createVue({
            template: `
            <el-menu>
                <vk-menu-item v-for='item in $store.getters.layoutMenus' :key="item.id" :item='item'></vk-menu-item>
            </el-menu>
            `,
            components: {
                vkMenuItem
            },
            store: Vue.store,
            methods: {
                login: function () {
                    return this.$store.dispatch("login", {
                        loginId: "admin",
                        password: "admin123"
                    }).then((res) => {
                        this.$logger.log("login view res", res);
                    });
                }
            }
        });

        vm.login().then(res => {
            // console.log("vm", vm.$store.getters.layoutMenus);
            expect(vm.$store.getters.layoutMenus).to.have.length(6);
            Vue.nextTick(() => {
                done();
            });
        }).catch((err) => {
            console.log("error:", err);
        });
    });
});
