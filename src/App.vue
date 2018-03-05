<template>
    <router-view v-loading.fullscreen.lock="$store.state.fullscreenLoading" :element-loading-text="$store.state.fullscreenLoadingContent || '内容加载中...'" />
</template>

<script>
    export default {
        name: "app",

        data () {
            return {};
        },

        computed: {},
        methods: {
            test: function (e) {
            }
        },

        created: function () {
        },

        components: {}
    };
</script>

<style lang="less" type="text/less">
// alias 需要加波浪号才可以运行
@import "~@/assets/less/fn.less";

body {
    background-color: #f5f5f5;
    margin: 0;
    font-family: PingFangSC-Light, 'helvetica neue', 'hiragino sans gb', arial, 'microsoft yahei ui', 'microsoft yahei', simsun, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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

// vuedal
.vuedal.image {
    padding: 0;
    img {
        display: block;
        width: 100%;
    }
}

.global-loading {
    background-color: white;
    position: fixed;
    top: 0px;
    bottom: -10px;
    left: 0px;
    right: 0px;
    z-index: 10000000;
    text-align: center;
    padding-top: 300px;
}

</style>
