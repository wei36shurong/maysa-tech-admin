<style lang="less" scoped>
@import "~@/assets/less/fn";
</style>

<template>
	<div class="communityLayout">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item 
                v-for="item in communityBreadcrumb"
                :key="item.path"
                v-if="item.title"
                :to="{ path: item.path }"
            >
                {{item.title}}
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                {{lastBreadcrumItem.listTitle}}
            </el-breadcrumb-item>
        </el-breadcrumb>
        <router-view />
	</div>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations } from "vuex";

export default {
    name: "CommunityLayout",
    computed: {
        ...mapState([
            "currentCommunityId",
            "currentBuildingId",
            "communityBreadcrumb"
        ]),
        lastBreadcrumItem () {
            return this.communityBreadcrumb[this.communityBreadcrumb.length - 1];
        }
    }
};
</script>
