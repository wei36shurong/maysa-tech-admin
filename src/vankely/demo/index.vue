<template lang="html" xmlns:v-on="http://www.w3.org/1999/xhtml">
    <h1>
        主体内容区块
    </h1>
</template>

<script>
    import { listMixin } from "@/mixins/list-mixins";

    export default {

        mixins: [listMixin],

        data () {
            return {};
        },
        watch: {},
        methods: {},

        created: function () {}
    };
</script>

<style scoped>
h1{
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>