<style scoped>

</style>

<template>
	<div class="communities">
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
