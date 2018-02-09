<style lang="less" scoped>
</style>
<template>
<div class="w-input">
    <el-input v-if="isEditable"
        v-bind="$props"
        v-model="currentValue"
        @keyup.native.enter="save"
        @keyup.native.esc="cancel"
        @blur="cancel"
    />
    <el-button v-else
        v-on="$listeners"
        @click.stop="onClick"
        :style="clickable ? {} : unclickableStyle"
        type="text">
        {{currentValue}}
    </el-button>
</div>
</template>


<script>
import { Input } from "element-ui";

export default {
    name: "WInput",
    watch: {
        value(val) {
            console.log("val", val);
            this.currentValue = val;
        }
    },
    mounted () {
        this.$nextTick(function () {
            console.log("nextTick", this.value);
            this.currentValue = this.value;
        });
    },
    data() {
        return {
            unclickableStyle: {
                color: "black",
                cursor: "initial"
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
        onClick () {
            if (!this.clickable) return;
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
            this.$request({ url: this.api, data, method: "put"});
            this.$emit("save");
            this.$emit("finish");
        }
    }
};
</script>