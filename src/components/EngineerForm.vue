<style scoped>
// eslint-disable-next-line no-constant-condition
>>> .el-input {
    width: 360px;
}
</style>

<template>
    <div class="engineerForm">
        <el-form :rules="rules" style="width:480px;" ref="form" :model="form" label-width="120px">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phoneNum">
                <el-input v-model="form.phoneNum"></el-input>
            </el-form-item>
            <el-form-item label="所属小区" prop="communityId">
                <el-select v-model="form.communityId" placeholder="请选择工程所属小区">
                    <el-option 
                        v-for="{communityName, id} in communities"
                        :key="id"
                        :label="communityName"
                        :value="id" 
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择工程师类型">
                    <el-option 
                        v-for="type in types"
                        :key="type"
                        :label="type"
                        :value="type" 
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="级别" prop="level">
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
                <el-button type="primary" @click="submit('form')">确认</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import isMobilePhone from "validator/lib/isMobilePhone";
export default {
    name: "EngineerForm",
    data() {
        return {
            communities: [],
            types: ["水电", "泥水", "涂料", "木", "门窗"],
            form: {
                name: "",
                phoneNum: "",
                communityId: null,
                type: "",
                level: ""
            },
            rules: {
                name: [{
                    required: true,
                    message: "请输入姓名",
                    trigger: "blur"
                }],
                phoneNum: [{
                    required: true,
                    message: "请输入手机号",
                    trigger: "blur"
                }, {
                    validator: (rule, value, callback) => {
                        if (!isMobilePhone(value, "zh-CN")) {
                            callback(new Error("invalid phone number."));
                        } else {
                            callback();
                        }
                    },
                    message: "输入的正确格式的手机号",
                    trigger: "blur"
                }],
                communityId: [{
                    required: true,
                    message: "请选择工程师所在社区",
                    trigger: "change"
                }],
                type: [{
                    required: true,
                    message: "请输入工程师类型",
                    trigger: "change"
                }],
                level: [{
                    required: true,
                    message: "请输入工程师级别",
                    trigger: "change"
                }]
            }
        };
    },
    async created() {
        const {data: {rows}} = await this.$request({url: "communities"});
        this.communities = rows;
    },
    methods: {
        async submit(formName) {
            await this.$refs[formName].validate();
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
