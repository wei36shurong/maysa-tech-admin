<style scoped>

</style>

<template>
	<div class="rooms">
		<my-vuetable
            row-class=""
			ref="vuetable"
			:api="`buildings/${currentBuildingId}/rooms`"
			:fields="fields"
            @vuetable:row-clicked="onRowClicked"
            :showActions="false"
		>
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
import { mapState } from "vuex";

export default {
    name: "Rooms",
    props: {
        buildingId: {
            type: String,
            default: "-1"
        }
    },
    computed: {
        ...mapState([
            "currentCommunityId",
            "currentBuildingId"
        ])
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
