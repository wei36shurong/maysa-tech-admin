<style scoped>

</style>

<template>
    <div class="engineerForm">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="姓名">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="form.phoneNum"></el-input>
            </el-form-item>
            <el-form-item label="所属小区">
                <el-select v-model="form.communityId" placeholder="请选择工程所属小区">
                    <el-option 
                        v-for="{communityName, id} in communities"
                        :key="id"
                        :label="communityName"
                        :value="id" 
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="form.type" placeholder="请选择工程师类型">
                    <el-option 
                        v-for="type in types"
                        :key="type"
                        :label="type"
                        :value="type" 
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="级别">
                <el-select v-model="form.level" placeholder="请选择工程师级别">
                    <el-option 
                        v-for="n in 5"
                        :key="n"
                        :label="`${n}级`"
                        :value="n" 
                    />
                </el-select>
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
    name: "EngineerForm",
    data() {
        return {
            communities: [],
            types: ["机械", "水电"],
            form: {
                name: "",
                phoneNum: "",
                communityId: null,
                type: "",
                level: ""
            }
        };
    },
    async created() {
        const {data: {rows}} = await this.$request({url: "communities"});
        this.communities = rows;
    },
    methods: {
        submit() {
            this.$request({
                url: "engineers",
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
