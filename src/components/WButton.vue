<style lang="less" scoped>
.w-input {
    cursor: pointer;
}
</style>
<template>
<el-button v-else
    class="ui primary button"
    :class="{
        disabled: isLoading,
        loading: isLoading,
        basic: selected
    }"
    v-bind="$props"
    @click.stop="submit"
    type="text">
    <slot></slot>
</el-button>
</template>


<script>
import { Button } from "element-ui";

export default {
    name: "WButton",
    data() {
        return {
            isLoading: false
        };
    },
    props: {
        ...Button.props,
        selected: { default: false, type: Boolean},
        handler: Function,
        // custom props
        api: String,
        data: Object,
        method: String

    },
    methods: {
        async submit() {
            this.isLoading = true;
            // 开始请求，少于1秒等1秒后再返回。
            await Promise.all([
                this.handler(),
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                })
            ]);
            this.isLoading = false;
            this.$emit("success");
        }
    }
};
</script>