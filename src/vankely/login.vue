<style lang="less" scoped>
@import "~@/assets/less/fn";
.login {
    background-color: @primary-color;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    h2 {
        img {margin-right: 10px;}
        display: flex;
        align-items: center;
        color: white;
    }
    .main {
        width: 350px;
        margin: 0 auto;
    }
}
</style>

<template>
    <div class="login">
        <main class="main">
            <section class="content">
                <h2>
                    <img :src="logo">
                    万匠维管理系统
                </h2>
                <el-form :model="ruleForm" :rules="rules" ref="loginForm" label-position="top" label-width="0px">
                    <el-form-item label="" prop="loginId">
                        <el-input v-model="ruleForm.loginId" required placeholder="登录名"></el-input>
                        <i class="tako-icon-login_icon_mine"></i>
                    </el-form-item>
                    <el-form-item label="" prop="password">
                        <el-input type="password" v-model="ruleForm.password" placeholder="密码"></el-input>
                        <i class="tako-icon-login_icon_lock"></i>
                    </el-form-item>
                    <el-form-item label="" prop="password">
                        <el-input type="text" v-model="ruleForm.captcha" placeholder="验证码">
                            <img slot="suffix" src="http://111.231.142.117:8088/admin/captcha" />
                        </el-input>
                    </el-form-item>
                    <el-form-item class="login-btn-form">
                        <el-button style="width:100%;" type="primary" @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </main>
    </div>
</template>

<script>
import logo from "@/assets/img/logo.png";

export default {
    name: "login",
    data () {
        return {
            logo,
            ruleForm: {
                loginId: "",
                password: "",
                userName: "2",
                captcha: ""
            },

            captcha: "",

            rules: {
                loginId: [
                    { required: true, message: " ", trigger: "blur" },
                    {
                        min: 1, max: 16, message: " ", trigger: "blur"
                    }
                ],
                password: [
                    { required: true, message: " ", trigger: "blur" },
                    {
                        min: 6, max: 16, message: " ", trigger: "blur"
                    }
                ],
                captcha: [
                    { required: true, message: " ", trigger: "blur" }
                ]
            }

        };
    },
    methods: {
        onBlur: function () {
            if (this.ruleForm.loginId.length < 1) {
                this.$message({
                    message: "请输入名称",
                    type: "warning"
                });
            } else if (this.ruleForm.loginId.length > 16) {
                this.$message({
                    message: "长度在 1 到 16 个字符",
                    type: "warning"
                });
            } else if (this.ruleForm.password.length < 1) {
                this.$message({
                    message: "请输入密码",
                    type: "warning"
                });
            } else if (this.ruleForm.password.length < 6 || this.ruleForm.password.length > 16) {
                this.$message({
                    message: "长度在 6 到 16 个字符",
                    type: "warning"
                });
            } else if (this.ruleForm.captcha.length < 1) {
                this.$message({
                    message: "请输入验证码",
                    type: "warning"
                });
            } else {
                return true;
            }
        },

        HandleCaptcha: function () {
            this.captcha = this.$api.Logincaptcha + "?" + Date.parse(new Date());
        },
        login: function () {
            this.loginFunc().catch(err => {

            });
        },
        loginFunc: function () {
            return new Promise((resolve, reject) => {
                this.$refs.loginForm.validate((valid) => {
                    this.$logger.log("[validate] ", valid);
                    if (valid) {
                        let redirect = this.$route.query.redirect;
                        redirect = !redirect ? "/admin/demo/index" : decodeURIComponent(redirect);
                        const data = {
                            ...this.ruleForm,
                            redirect: redirect
                        };
                        return this.$store.dispatch("login", data).then((res) => {
                            this.$logger.log("login view res", res);
                            resolve(res);
                        }).catch((err) => {
                            this.$logger.warn("login err:", err);
                            this.$message({
                                showClose: true,
                                message: err.message,
                                type: "error"
                            });
                            reject(err);
                            this.HandleCaptcha(); //解决:登录错误后，验证码要自动刷新一下 --lyd-9-5
                        });
                    } else {
                        this.$logger.log("error submit!!");
                        this.onBlur();
                        reject();
                    }
                });
            });
        }
    },
    created: function (event) {
        this.HandleCaptcha();
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
