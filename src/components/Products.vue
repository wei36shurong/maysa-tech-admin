<style scoped>

</style>

<template>
	<div class="products">
		<my-vuetable
			:api="`locations/${currentLocationId}/products`"
			:fields="fields"
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

const fields = [
    { name: "productName", title: "产品名称" }
].map(field => ({...field, sortField: field.name}));

export default {
    name: "Products",
    computed: {
        ...mapState([
            "currentLocationId"
        ])
    },
    data() {
        return {
            fields
        };
    },
    methods: {}
};
</script>
