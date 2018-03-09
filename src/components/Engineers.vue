<style scoped>
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
			ref="vuetable"
			api="engineers"
			:fields="fields"
            @vuetable:row-clicked="onRowClicked"
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
import orderMixins from "@/mixins/order-mixins";

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
                escapable: true,
                onClose: (res) => {
                    if (res === "success") {
                        this.$refs.vuetable.reload();
                    }
                }
            });
        },
        async onRowClicked ({id}) {
            this.$vuedals.open({
                title: "工程师订单列表",
                name: "no-header-gap",
                escapable: true,
                component: {
                    name: "ResidentDetailModal",
                    props: ["orderId"],
                    mixins: [orderMixins],
                    data() {
                        return {
                            fields: [
                                { name: "detail", title: "故障描述"},
                                { name: "communityName", title: "小区"},
                                { name: "buildingName", title: "楼栋" },
                                { name: "roomName", title: "单元号" },
                                {
                                    title: "状态",
                                    name: "__slot:status",
                                    titleClass: "status-cell"
                                }
                            ]
                        };
                    },
                    template: `
                        <my-vuetable
                            ref="vuetable"
                            api="engineers/${id}/orders/"
                            :appendParams="status != 0 ? {status} : {}"
                            :fields="fields"
                            :formatter="formatter"
                            :css="{tableClass: 'ui selectable plain gapped unstackable table no-header-gap'}"
                            @vuetable:row-clicked="onRowClicked"
                        >
                            <div
                                slot="status"
                                slot-scope="{rowData}">
                                <i :class="[rowData.statusClass]"
                                    class="circle icon"/>
                                <span> {{rowData.statusName}} </span>
                            </div>
                        </my-vuetable>
                    `
                }
            });
        }
    }
};
</script>
