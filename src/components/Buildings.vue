<style lang="less" scoped>
nav {
    display: flex;
    align-items: center;
    justify-content: center;
    .breadcrumb { flex: 1; }
}
</style>

<template>
	<div class="buildings">
        <nav>
            <breadcrumb />
            <el-button @click="add"> 添加楼栋 </el-button>
        </nav>
		<my-vuetable
			ref="vuetable"
			:api="`communities/${currentCommunityId}/buildings`"
			:fields="fields"
            @vuetable:row-clicked="onRowClicked"
        >
			<div
				slot="status"
				slot-scope="{rowData}">
				<i :class="[rowData.statusClass]"
					class="circle icon"/>
				<span> {{rowData.statusName}} </span>
			</div>
		</my-vuetable>
        <vuedals />
	</div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import buildingForm from "@/components/BuildingForm";

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
        add() {
            this.$vuedals.open({
                title: "添加楼栋",
                component: buildingForm,
                onClose: (res) => {
                    if (res === "success") this.$refs.vuetable.reload();
                }
            });
        },
        ...mapMutations([
            "changeBuilding"
        ]),
        onRowClicked (data) {
            this.$router.push(`/admin/communities/${this.currentCommunityId}/buildings/${data.id}/rooms`);
            this.changeBuilding(data);
        }
    }
};
</script>
