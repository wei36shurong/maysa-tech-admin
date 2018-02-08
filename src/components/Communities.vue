<style scoped>

</style>

<template>
	<div class="communities">
		<my-vuetable
			ref="vuetable"
			api="communities"
			:fields="fields"
            @vuetable:row-clicked="onRowClicked"
			detail-modal-component="community-detail">
			<div
				slot="status"
				slot-scope="{rowData}">
				<i :class="[rowData.statusClass]"
					class="circle icon"/>
				<span> {{rowData.statusName}} </span>
			</div>
		</my-vuetable>
	</div>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations } from "vuex";

// import FileUpload from "vue-upload-component";
import detail from "@/components/CommunityDetail";
import fields from "@/components/FieldDefsCommunity.js";

Vue.component("community-detail", detail);

export default {
    name: "Communities",
    computed: {
        ...mapState([
            "currentCommunityId",
            "currentBuildingId"
        ])
    },
    data() {
        return {
            communityId: -1,
            fields
        };
    },
    methods: {
        ...mapMutations([
            "changeCommunity"
        ]),
        onRowClicked ({id}) {
            this.$router.push(`/admin/community-layout/communities/${id}/buildings`);
            this.changeCommunity(id);
        }
    }
};
</script>
