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
import fields from "@/components/FieldDefsProduct.js";

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
