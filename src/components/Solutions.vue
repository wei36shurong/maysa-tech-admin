<style scoped>

</style>

<template>
	<div class="solutions">
        <el-button @click="add"> 添加解决方案 </el-button>
		<my-vuetable
			ref="vuetable"
			api="solutions"
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
        <vuedals />
	</div>
</template>

<script>
import solutionForm from "@/components/solutionForm";

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
    methods: {
        add() {
            this.$vuedals.open({
                title: "添加解决方案",
                component: solutionForm,
                onClose: (res) => {
                    if (res === "success") this.$refs.vuetable.reload();
                }
            });
        }
    }
};
</script>
