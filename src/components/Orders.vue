<style scoped>

</style>

<template>
	<div class="orders">
		<my-vuetable
			ref="vuetable"
			api="orders"
			:fields="fields"
			:formatter="formatter"
            @vuetable:row-clicked="onRowClicked"
            @edit="onEdit"
        >
			<div
				slot="detail"
				slot-scope="{rowData}">
                <w-input :value="rowData.detail"
                    type="textarea"
                    :api="`orders/${rowData.id}`"
                    :ref="`input-${rowData.id}`"
                    :clickable="false"
                    @save="$refs.vuetable.reload"
                    @finish="editing = false"
                    name="detail" />
			</div>
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
    { name: "code", title: "订单编号" },
    {
        name: "detail",
        title: "故障描述",
        dataClass: "three wide",
        titleClass: "three wide"
    }, {
        name: "communityName",
        title: "小区",
        titleClass: "two wide"
    },
    { name: "buildingName", title: "楼栋" },
    { name: "roomName", title: "单元号" },
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
            editing: false,
            id: null,
            fields: [
                ...fields,
                {
                    title: "状态",
                    name: "__slot:status",
                    // sortField: 'status', // slot field不能这么做
                    callback: "statusFormatter"
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
    methods: {
        onEdit (id) {
            this.editing = true;
            this.$refs[`input-${id}`].edit();
        },
        onRowClicked ({id}) {
            if (this.editing) return;
            this.id = id;
            this.$vuedals.open({
                title: "订单详情",
                component: detail,
                props: {
                    id: this.id
                }
            });
        }
    }
};
</script>
