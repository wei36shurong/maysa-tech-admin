<template lang='html'>
    <div>
        <header>
            <el-dropdown class='header-user' trigger='click' @command='handleHeader'>
                    <span class='el-dropdown-link'>
                        {{loginName}}
                        <i class='tako-icon-search_arrow_list_de'></i>
                    </span>
                <el-dropdown-menu slot='dropdown'>
                    <el-dropdown-item command='logout'>退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </header>

        <router-view class='subviews' style="position: relative;overflow-y: scroll"></router-view>
    </div>
</template>

<script>
    export default {
        name: "layout",
        data () {
            return {
                percentage: 0,
                speed: 5
            };
        },
        computed: {
            logoRes: function () {
                return "";
            },
            loginName: function () {
                return this.$store.state.loginUser.userName;
            },
            vankelyMenus: function () {
                const vankelyMenus = this.$store.getters.layoutMenus;
                // this.$logger.log("vankelyMenus:", vankelyMenus);
                return vankelyMenus;
            },
            activeMenu: function () {
                this.$logger.log("route", this.$route.meta);
                const meta = this.$route.meta;
                if (typeof meta === "string") {
                    return meta;
                }
                return "";
            },
            fullscreenLoading: function () {
                this.onPercentage();
                return this.$store.state.fullscreenLoading;
            }
        },
        methods: {
            handleHeader (command) {
                if (command === "user_info") {
                    this.$router.push("/users/current/basic/info");
                } else if (command === "logout") {
                    this.$confirm("确认退出吗?", "提示", {
                        type: "warning"
                    }).then(async () => {
                        await this.$store.dispatch("logout");
                    }).catch((err) => {
                        if (err === "cancel") {
                            return;
                        }
                        this.$message("" + err);
                    });
                }
            },
            handleProject (command) {
                // this.$message('handleProject:' + command)
            },

            handleOpen (index) {
                // this.$message('handleOpen:' + index)
            },

            handleClose (index) {
                // this.$message('handleClose:' + index)
            },

            handleSelect (index) {
                // this.$message('handleSelect:' + index)
            },

            onHome () {
                this.$router.push("/admin/home");
            },

            // 设置加载的样式
            onPercentage () {
                this.percentage = 0;
                setInterval(() => {
                    if (this.percentage < 100) {
                        this.percentage += this.speed;
                        this.speed = (100 - this.percentage) / 1000;
                    } else {
                        this.percentage = 0;
                    }
                }, 30);
            }
        },
        created: function () {
        },

        components: {}

    };
</script>

<style lang='css' scoped>
</style>
