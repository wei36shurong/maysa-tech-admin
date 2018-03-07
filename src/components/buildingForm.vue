<style scoped>

</style>

<template>
    <div class="engineerForm">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="楼栋名称">
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
import { mapState } from "vuex";
export default {
    name: "BuildingForm",
    data() {
        return {
            form: {
                name: ""
            }
        };
    },
    computed: {
        ...mapState([
            "currentCommunityId"
        ])
    },
    methods: {
        submit() {
            this.$request({
                url: `communities/${this.currentCommunityId}/buildings`,
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
