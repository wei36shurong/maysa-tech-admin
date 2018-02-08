<style lang="less" scoped>
@import "~@/assets/less/fn";

</style>

<template>
	<div class="communityLayout">
        <breadcrumbs />
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
    }
};
</script>
