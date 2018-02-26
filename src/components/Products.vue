<style scoped>

</style>

<template>
	<div class="products">
        <el-button @click="add"> 添加产品 </el-button>
		<my-vuetable
			ref="vuetable"
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
import productForm from "@/components/ProductForm";

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
    methods: {
        add() {
            this.$vuedals.open({
                title: "添加产品",
                component: productForm,
                onClose: (res) => {
                    if (res === "success") this.$refs.vuetable.reload();
                }
            });
        }
    }
};
</script>
