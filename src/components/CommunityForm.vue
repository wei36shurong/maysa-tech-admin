<style scoped>

</style>

<template>
    <div class="engineerForm">
        <el-form @keydown.native.esc="cancel" ref="form" :model="form" label-width="120px">
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
        submit() {
            this.$request({
                url: "communities",
                method: "post",
                data: this.form
            }).then(() => {
                this.$vuedals.close("success");
            }).catch(res => {
                this.$message({
                    type: "error",
                    message: res.message
                });
            });
        },
        cancel() {
            this.$vuedals.close("cancel");
        }
    }
};
</script>
