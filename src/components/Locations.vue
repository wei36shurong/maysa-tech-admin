<style scoped>

</style>

<template>
	<div class="locations">
		<my-vuetable
			api="locations"
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
