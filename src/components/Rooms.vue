<style scoped>

</style>

<template>
	<div class="rooms">
		<my-vuetable
			ref="vuetable"
			:api="`buildings/${buildingId}/rooms`"
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
// import FileUpload from "vue-upload-component";
import detail from "@/components/CommunityDetail";

Vue.component("room-detail", detail);

export default {
    name: "Rooms",
    props: {
        buildingId: {
            type: String,
            default: "-1"
        }
    },
    data() {
        return {
            fields: [
                { name: "name", title: "房间名称" },
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
        onRowClicked (data) {
            this.communityId = data.id;
            this.$emit("communityChanged", data.id);
        }
    }
};
</script>
