<style scoped>

</style>

<template>
	<div class="buildings">
		<my-vuetable
			ref="vuetable"
			:api="`communities/${currentCommunityId}/buildings`"
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

export default {
    name: "Buildings",
    computed: {
        ...mapState([
            "currentCommunityId"
        ])
    },
    data() {
        return {
            fields: [
                { name: "buildingName", title: "楼栋名称" },
                { name: "createTime", title: "创建时间" },
                {
                    name: "updateTime",
                    sortField: "updateTime",
                    title: "更新时间"
                }
            ]
        };
    },
    methods: {
        ...mapMutations([
            "changeBuilding"
        ]),
        onRowClicked (data) {
            this.$router.push(`/admin/community-layout/communities/${this.currentCommunityId}/buildings/${data.id}/rooms`);
            this.changeBuilding(data);
        }
    }
};
</script>
