<style lang="less" scoped>
</style>
<template>
  <span>
    <router-link :to="{path: route.path, params: $route.params}">
        {{formattedValue}}  
    </router-link>
  </span>
</template>

<script>
export default {
    name: "DynamicBreadcrumbItem",
    props: ["route"],
    computed: {
        formattedValue() {
            const text = this.route.meta.breadcrumbText;
            if (text) return text;
            const breadcrumbItem = this.$store.state[this.route.meta.breadcrumbItem];
            const formatter = this.route.meta.formatter;
            console.log(breadcrumbItem);
            if (!breadcrumbItem) return "";
            if (!formatter) return "";
            return this.route.meta.formatter(breadcrumbItem);
        }
    }
};
</script>