<style lang="less" scoped>
nav {
    display: flex;
    align-items: center;
    justify-content: center;
    .breadcrumb { flex: 1; }
}
</style>

<template>
	<div class="locations">
        <nav>
            <breadcrumb />
            <el-button 
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="add"
            > 添加位置 </el-button>
        </nav>
		<my-vuetable
			api="locations"
			ref="vuetable"
            @vuetable:row-clicked="onRowClicked"
			:fields="fields">
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
import locationForm from "@/components/LocationForm";

const fields = [
    { name: "locationName", title: "位置名称" }
].map(field => ({...field, sortField: field.name}));

export default {
    name: "Locations",
    data() {
        return {
            fields
        };
    },
    methods: {
        add() {
            this.$vuedals.open({
                title: "添加位置",
                component: locationForm,
                escapable: true,
                onClose: (res) => {
                    if (res === "success") this.$refs.vuetable.reload();
                }
            });
        },
        ...mapMutations([
            "changeLocation"
        ]),
        onRowClicked (data) {
            this.$router.push(`/admin/locations/${data.id}/products`);
            this.changeLocation(data);
        }
    }
};
</script>
