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
Vue.component("engineer-detail", detail);

const fields = [
    { name: "avatar", title: "头像" },
    { name: "name", title: "姓名" },
    { name: "communityName", title: "所在小区" },
    { name: "type", title: "类型" },
    { name: "level", title: "等级" },
    { name: "phoneNum", title: "电话" },
    { name: "createTime", title: "创建时间" },
    { name: "updateTime", title: "更新时间" }
].map(field => ({...field, sortField: field.name}));

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
