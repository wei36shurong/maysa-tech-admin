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
Vue.component("solution-detail", detail);

const fields = [
    { name: "name", title: "解决方案名称" },
    { name: "createTime", title: "创建时间" },
    {
        name: "updateTime",
        sortField: "updateTime",
        title: "更新时间"
    }
].map(field => ({...field, sortField: field.name}));

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
