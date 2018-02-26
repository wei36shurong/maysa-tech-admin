<style scoped>

</style>

<template>
	<div class="locations">
        <el-button @click="add"> 添加位置 </el-button>
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
                title: "添加楼栋",
                component: locationForm,
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
