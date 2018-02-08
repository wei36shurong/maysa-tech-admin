<template>
<el-input v-if="isEditable"
    v-bind="$props"
    v-model="currentValue"
    @keyup.native.enter="save"
/>
<el-button v-else
    v-on="$listeners"
    @click="isEditable = true"
    type="text">
    {{currentValue}}
</el-button>
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
    data() {
        return {
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
        name: String,
        api: String
    },
    methods: {
        async save() {
            this.isEditable = false;
            if (!this.name || !this.api) return;
            const data = {
                [this.name]: this.currentValue
            };
            await this.$request({ url: this.api, data, method: "put"});
            this.$emit("save");
        }
    }
};
</script>