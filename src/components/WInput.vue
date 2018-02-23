<style lang="less" scoped>
.w-input {
    cursor: pointer;
}
</style>
<template>
<div class="w-input" :class="">
    <el-input v-if="isEditing"
        v-bind="$props"
        v-model="currentValue"
        @keyup.native.enter="save"
        @keyup.native.esc="cancel"
    />
    <p v-else
        @click="onClick"
        :style="clickable ? {} : unclickableStyle"
        type="text">
        {{currentValue || placeholder}}
    </p>
    <div v-if="isEditing">
        <w-button
            :handler="() => save()"
        >保存</w-button>
        <el-button 
            @click="cancel"
        plain>取消</el-button>
    </div>
</div>
</template>


<script>
import { Input } from "element-ui";

export default {
    name: "WInput",
    watch: {
        value(val) {
            console.log("watch");
            this.currentValue = val;
        }
    },
    mounted () {
        this.$nextTick(() => {
            console.log("nextTick");
            this.currentValue = this.value;
        });
    },
    data() {
        return {
            unclickableStyle: {
                color: "black",
                cursor: "inherit"
            },
            isEditing: false,
            currentValue: "",
            events: {
                ...this.$listeners
            }
        };
    },
    model: {
        prop: "value",
        event: "save"
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
            this.isEditing = true;
        },
        cancel () {
            console.log("cancel");
            this.isEditing = false;
            this.currentValue = this.value;
            this.$emit("cancel");
            this.$emit("finish");
        },
        edit () {
            this.isEditing = true;
            this.disabled = false;
            this.$emit("edit");
        },
        async save() {
            this.isEditing = false;
            if (!this.name || !this.api) return;
            const data = {
                [this.name]: this.currentValue
            };
            await this.$request({ url: this.api, data, method: "put"});
            this.$emit("save", this.currentValue);
            this.$emit("finish");
        }
    }
};
</script>