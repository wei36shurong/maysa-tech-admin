<style scoped>

</style>

<template>
	<div class="solutions">
		<my-vuetable
			ref="vuetable"
			api="solutions"
			:fields="fields"
			detail-modal-component="solution-detail">
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
import detail from "@/components/SolutionDetail";
import fields from "@/components/FieldDefsSolution.js";

Vue.component("solution-detail", detail);
export default {
    name: "Solutions",
    data() {
        return {
            fields
        };
    },
    methods: {}
};
</script>
