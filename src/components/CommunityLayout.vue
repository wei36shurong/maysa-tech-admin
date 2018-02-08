<style lang="less" scoped>
@import "~@/assets/less/fn";

</style>

<template>
	<div class="communityLayout">
        <el-breadcrumb class="ui massive breadcrumb" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="active section" :to="{ path: '/admin/community-layout/communities' }">
                小区
            </el-breadcrumb-item>
            <el-breadcrumb-item class="section" :to="{ path: `/admin/community-layout/communities/${currentCommunityId}/buildings` }">
                楼栋
            </el-breadcrumb-item>
            <el-breadcrumb-item class="section"  :to="{ path: `/admin/community-layout/buildings/${currentBuildingId}/rooms` }">
                房间
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
            "currentBuildingId"
        ])
    },
    created() {
        console.log(this.$router);
    }
};
</script>
