<style scoped>

</style>

<template>
    <div class="engineerForm">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="小区名称">
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
    name: "CommunityForm",
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
                url: "communities",
                method: "post",
                data: this.form
            }).catch((message) => {
                this.$message({
                    type: "error",
                    message
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
