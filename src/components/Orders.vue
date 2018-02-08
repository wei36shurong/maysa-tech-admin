<style scoped>

</style>

<template>
	<div class="orders">
		<my-vuetable
			ref="vuetable"
			:api="api"
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
        <div class="ui modal detail-modal">
            <detail ref="detail" :id="id"/>
        </div>
	</div>
</template>

<script>
import Vue from "vue";
import FieldDefs from "@/components/FieldDefsOrder.js";
import detail from "@/components/OrderDetail";
import { statusMap, statusColorMap } from "@/conf/constants";

export default {
    name: "Orders",
    components: {detail},
    data() {
        return {
            id: null,
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
    mounted () {
    },
    methods: {
        onRowClicked ({id}) {
            this.id = id;
            // 显示详情
            const modal = $(".detail-modal").modal({
                onHidden: () => {
                    this.$refs.vuetable.reload();
                }
            });
            // 有时候弹窗位置不对的quick fix
            setTimeout(() => { modal.modal("show"); }, 100);
        }
    }
};
</script>
