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
.icon {
    color: @primary-color;
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
        {{currentValue ? formatter(currentValue) : placeholder}}
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
        dataType: {
            type: String,
            default: "String"
        },
        formatter: {
            type: Function,
            default: val => val
        },
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
            let value = this.currentValue;
            if (!this.name || !this.api) return;
            if (this.dataType === "number") value = Number(this.currentValue);
            if (this.dataType === "boolean") value = Boolean(this.currentValue);

            const data = {
                [this.name]: value
            };
            await this.$request({ url: this.api, data, method: "put"});
            this.$emit("save", this.currentValue);
            this.$emit("finish");
        }
    }
};
</script>