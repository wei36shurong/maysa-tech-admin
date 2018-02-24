<style lang="less" scoped>
.w-input {
    cursor: pointer;
}
</style>
<template>
<el-button v-else
    v-bind="$props"
    type="primary"
    :plain="onOff"
    :disabled="isLoading"
    :loading="isLoading"
    @click.stop="submit"
    >
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
        // 开关状态
        onOff: { default: false, type: Boolean}, // true = on, false = off
        handler: Function
    },
    model: {
        prop: "onOff",
        event: "success"
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
            this.$emit("success", !this.onOff);
        }
    }
};
</script>