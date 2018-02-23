<style scoped>

</style>

<template>
	<div class="products">
		<my-vuetable
			api="products"
			:fields="fields"
			detail-modal-component="product-detail">
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
import detail from "@/components/ProductDetail";

const fields = [
    { name: "productName", title: "产品名称" },
    { name: "locationName", title: "所在位置" }
].map(field => ({...field, sortField: field.name}));

Vue.component("product-detail", detail);
export default {
    name: "Products",
    data() {
        return {
            fields
        };
    },
    methods: {}
};
</script>
