
<template>
	<div class="communityLayout">
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
