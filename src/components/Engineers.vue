

</style>

<template>
	<div class="engineers">
        <el-button 
            type="primary"
            icon="el-icon-circle-plus-outline"
            style="float:right;"
            @click="add"
        > 
            添加工程师 
        </el-button>
		<my-vuetable
            row-class=""
			ref="vuetable"
			api="engineers"
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
import engineerForm from "@/components/EngineerForm";

const fields = [
    { name: "name", title: "姓名" },
    { name: "communityName", title: "所在小区" },
    { name: "type", title: "类型" },
    { name: "level", title: "等级" },
    { name: "phoneNum", title: "电话" }
].map(field => ({...field, sortField: field.name}));

export default {
    name: "Engineers",
    data() {
        return {
            fields
        };
    },
    methods: {
        add() {
            this.$vuedals.open({
                title: "添加工程师",
                component: engineerForm,
                onClose: (res) => {
                    if (res === "success") {
                        this.$refs.vuetable.reload();
                    }
                }
            });
        }
    }
};
</script>
