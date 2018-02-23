<style lang="less" scoped>
.w-input {
    cursor: pointer;
}
</style>
<template>
<div class="w-input" :class="">
    <el-input v-if="isEditable"
        v-bind="$props"
        v-model="currentValue"
        @keyup.native.enter="save"
        @keyup.native.esc="cancel"
        @blur="cancel"
    />
    <p v-else
        @click="onClick"
        :style="clickable ? {} : unclickableStyle"
        type="text">
        {{currentValue || placeholder}}
    </p>
    <w-button
    >保存</w-button>
    <el-button plain>取消</el-button>
</div>
</template>


<script>
import { Input } from "element-ui";

export default {
    name: "WInput",
    watch: {
        value(val) {
            this.currentValue = val;
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.currentValue = this.value;
        });
    },
    data() {
        return {
            unclickableStyle: {
                color: "black",
                cursor: "inherit"
            },
            isEditable: false,
            currentValue: "",
            events: {
                ...this.$listeners
            }
        };
    },
    props: {
        ...Input.props,
        clearable: { default: true },
        placeholder: { default: "Please input" },
        // custom props
        clickable: {
            type: Boolean,
            default: false
        },
        name: String,
        api: String
    },
    methods: {
        onClick (event) {
            if (!this.clickable) return;
            event.stopPropagation();
            this.isEditable = true;
        },
        cancel () {
            this.isEditable = false;
            this.currentValue = this.value;
            this.$emit("cancel");
            this.$emit("finish");
        },
        edit () {
            this.isEditable = true;
            this.disabled = false;
            this.$emit("edit");
        },
        async save() {
            this.isEditable = false;
            if (!this.name || !this.api) return;
            const data = {
                [this.name]: this.currentValue
            };
            await this.$request({ url: this.api, data, method: "put"});
            this.$emit("save");
            this.$emit("finish");
        }
    }
};
</script>