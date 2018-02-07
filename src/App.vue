<template>
    <div class="root-views">
        <router-view v-loading.fullscreen.lock="$store.state.fullscreenLoading" :element-loading-text="$store.state.fullscreenLoadingContent || '内容加载中...'" class="root-views"></router-view>
    </div>
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

<style lang="less" scoped type="text/less">
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
<!-- <script src="http://gosspublic.alicdn.com/aliyun-oss-sdk-4.4.4.min.js"></script> -->
