<style scoped>

</style>

<template>
	<div class="orders">
		<my-vuetable
			ref="vuetable"
			:api="api"
			:fields="fields"
			:formatter="formatter"
			detail-modal-component="order-detail">
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
import FieldDefs from "@/components/FieldDefsOrder.js";
import detail from "@/components/OrderDetail";
import { statusMap, statusColorMap } from "@/conf/constants";

Vue.component("order-detail", detail);
export default {
    name: "Orders",
    data() {
        return {
            api: "orders",
            fields: [
                ...FieldDefs,
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
    methods: {}
};
</script>
