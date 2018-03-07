<style scoped>

</style>

<template>
    <div class="engineerForm">
        <el-form @keydown.native.esc="cancel" ref="form" :model="form" label-width="120px">
            <el-form-item label="位置名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">确认</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "BuildingForm",
    data() {
        return {
            form: {
                name: ""
            }
        };
    },
    methods: {
        async submit() {
            await this.$request({
                url: "locations",
                method: "post",
                data: this.form
            }).catch(res => {
                this.$message({
                    type: "error",
                    message: res.message
                });
            });
            this.$vuedals.close("success");
        },
        cancel() {
            this.$vuedals.close("cancel");
        }
    }
};
</script>
