<template lang='html'>
    <div>
        <el-menu
            default-active="/admin/orders"
            mode="horizontal"
            @select="handleSelect"
            background-color="#2196F3"
            router
            text-color="#fff"
            active-text-color="#fff">
            <el-menu-item index="/admin/orders">订单列表</el-menu-item>
            <el-menu-item index="/admin/products">产品列表</el-menu-item>
            <el-menu-item index="/admin/engineers">工程师列表</el-menu-item>
            <el-menu-item index="/admin/solutions">解决方案列表</el-menu-item>
            <el-menu-item index="/admin/communities">小区列表</el-menu-item>
        </el-menu>
        <router-view class='subviews' style="position: relative;overflow-y: scroll" />
    </div>
</template>

<script>
export default {
    name: "layout",
    data() {
        return {
            percentage: 0,
            speed: 5
        };
    },
    computed: {
        logoRes: function() {
            return "";
        },
        loginName: function() {
            return this.$store.state.loginUser.userName;
        },
        vankelyMenus: function() {
            const vankelyMenus = this.$store.getters.layoutMenus;
            // this.$logger.log("vankelyMenus:", vankelyMenus);
            return vankelyMenus;
        },
        activeMenu: function() {
            this.$logger.log("route", this.$route.meta);
            const meta = this.$route.meta;
            if (typeof meta === "string") {
                return meta;
            }
            return "";
        },
        fullscreenLoading: function() {
            this.onPercentage();
            return this.$store.state.fullscreenLoading;
        }
    },
    methods: {
        handleHeader(command) {
            if (command === "user_info") {
                this.$router.push("/users/current/basic/info");
            } else if (command === "logout") {
                this.$confirm("确认退出吗?", "提示", {
                    type: "warning"
                })
                    .then(async () => {
                        await this.$store.dispatch("logout");
                    })
                    .catch(err => {
                        if (err === "cancel") {
                            return;
                        }
                        this.$message("" + err);
                    });
            }
        },
        handleProject(command) {
            // this.$message('handleProject:' + command)
        },

        handleOpen(index) {
            // this.$message('handleOpen:' + index)
        },

        handleClose(index) {
            // this.$message('handleClose:' + index)
        },

        handleSelect(index) {
            // this.$message('handleSelect:' + index)
        },

        onHome() {
            this.$router.push("/admin/home");
        },

        // 设置加载的样式
        onPercentage() {
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
    created: function() {},

    components: {}
};
</script>

<style lang='less'>
// alias 需要加波浪号才可以运行
@import "~@/assets/less/fn.less";

body {
    background-color: #f5f5f5;
    margin: 0;
}
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

// table
table.table.plain {
    &,
    & td,
    & th {
        border: none;
    }
}
table.table.gapped {
    border-spacing: 0 20px;
    border-collapse: separate;
    background-color: transparent;
    td,
    th {
        background-color: white;
        border-bottom: 1px solid rgba(34, 36, 38, 0.1);
    }
}
table.table.no-header {
    th {
        display: none;
    }
}
</style>
