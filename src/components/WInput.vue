<style lang="less" scoped>
@import "~@/assets/less/fn.less";
.w-input {
    &:extend(.clickable);
    &:hover {
        color: @primary-color;
    }
}
.unclickable {
    color: "black";
    cursor: "inherit";
}
.buttons {
    float: right;
    margin-top: 10px;
}
</style>
<template>
<div class="w-input" :class="">
    <el-input v-if="isEditing"
        v-bind="$props"
        v-model="currentValue"
        autofocus
    />
    <p v-else
        @click="onClick"
        type="text">
        {{currentValue || placeholder}}
        <i class="edit outline icon" />
    </p>
    <div v-if="isEditing" class="buttons">
        <el-button @click="save" type="primary">保存</el-button>
        <el-button @click="cancel" plain>取消</el-button>
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
        name: String,
        api: String
    },
    methods: {
        onClick (event) {
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