<style lang="less" scoped>
nav {
    display: flex;
    align-items: center;
    justify-content: center;
    .breadcrumb { flex: 1; }
}
</style>

<template>
	<div class="communities">
        <nav>
            <breadcrumb />
            <el-button 
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="add"
            > 添加小区 </el-button>
        </nav>
		<my-vuetable
			ref="vuetable"
			api="communities"
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
	</div>
</template>

<script>
import { mapMutations } from "vuex";
import communityForm from "@/components/communityForm";

const fields = [
    { name: "communityName", title: "小区名称" },
    { name: "createTime", title: "创建时间" },
    {
        name: "updateTime",
        sortField: "updateTime",
        title: "更新时间"
    }
].map(field => ({...field, sortField: field.name}));

export default {
    name: "Communities",
    data() {
        return {
            communityId: -1,
            fields
        };
    },
    methods: {
        add() {
            this.$vuedals.open({
                title: "添加工程师",
                component: communityForm,
                escapable: true,
                onClose: (res) => {
                    if (res === "success") this.$refs.vuetable.reload();
                }
            });
        },
        ...mapMutations([
            "changeCommunity"
        ]),
        onRowClicked (data) {
            this.$router.push(`/admin/communities/${data.id}/buildings`);
            this.changeCommunity(data);
        }
    }
};
</script>
