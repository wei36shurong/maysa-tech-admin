<style lang="less">
@import "~@/assets/less/fn";

.detail-cell {
    &:extend(.text-ellipsis);
    max-width: 150px;
}
.room-cell { 
    &:extend(.text-ellipsis);
    max-width: 100px; 
}
.status-cell { width: 100px; }
.building-cell { width: 86px; }
</style>

<template>
	<div class="orders">
        <el-menu default-active="0" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="0"> 全部 </el-menu-item>
            <el-menu-item 
            v-for="(status, key) in statusMap"
            :key="status"
            :index="key">
				<i 
                    style="display:inline;"
                    :class="statusColorMap[key]"
                    class="circle icon"/>
                {{status}}
            </el-menu-item>
        </el-menu>
		<my-vuetable
			ref="vuetable"
			api="orders"
            :appendParams="status != 0 ? {status} : {}"
			:fields="fields"
			:formatter="formatter"
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
import detail from "@/components/OrderDetail";
import { statusMap, statusColorMap } from "@/conf/constants";

const fields = [
    // { name: "code", title: "订单编号" },
    {
        name: "detail",
        title: "故障描述",
        dataClass: "detail-cell"
    }, {
        name: "communityName",
        title: "小区",
        dataClass: "detail-cell"
    },
    { name: "buildingName", dataClass: "building-cell", title: "楼栋" },
    { name: "roomName", dataClass: "room-cell", title: "单元号" },
    { name: "createTime", title: "创建时间" },
    { name: "updateTime", title: "更新时间" }
];

fields.map(field => {
    field.sortField = field.name;
    return field;
});

export default {
    name: "Orders",
    components: {detail},
    data() {
        return {
            status: "",
            statusMap,
            statusColorMap,
            id: null,
            fields: [
                ...fields,
                {
                    title: "状态",
                    name: "__slot:status",
                    titleClass: "status-cell"
                }
            ],
            formatter(data) {
                data.data.rows = data.data.rows.map(row => {
                    return {
                        ...row,
                        statusName: statusMap[row.status],
                        statusClass: statusColorMap[row.status]
                    };
                });
                return data;
            }
        };
    },
    watch: {
        status() {
            this.$nextTick(() => {
                this.$refs.vuetable.reload();
            });
        }
    },
    methods: {
        handleSelect(status) {
            this.status = status;
        },
        onRowClicked({id}) {
            console.log("order row clicked");
            this.id = id;
            this.$vuedals.open({
                title: "订单详情",
                // size: "lg",
                component: detail,
                props: { id: this.id },
                onDismiss: () => {
                    this.$refs.vuetable.reload();
                }
            });
        }
    }
};
</script>
