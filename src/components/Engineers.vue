<style scoped>

</style>

<template>
	<div class="engineers">
		<my-vuetable
			ref="vuetable"
			api="engineers"
			:fields="fields"
			detail-modal-component="engineer-detail">
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
import detail from "@/components/EngineerDetail";
import fields from "@/components/FieldDefsEngineer.js";

Vue.component("engineer-detail", detail);
export default {
    name: "Engineers",
    data() {
        return {
            fields
        };
    },
    methods: {}
};
</script>
