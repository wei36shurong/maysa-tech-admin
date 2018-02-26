<style lang="less" scoped>
@import "~@/assets/less/fn";
.el-breadcrumb {
    font-size: 16px;
}
</style>
<template>
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item 
            v-for="route in $route.matched.filter(item => item.meta.isBreadcrumb)"
            :key="route.path"
        >
            <dynamic-breadcrumb-item :route="route" />
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
import DynamicBreadcrumbItem from "@/components/DynamicBreadcrumbItem";

export default {
    name: "Breadcrumb",
    components: {DynamicBreadcrumbItem}
};
</script>