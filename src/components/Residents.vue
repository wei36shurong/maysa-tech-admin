<style scoped>

</style>

<template>
	<div class="engineers">
		<my-vuetable
			ref="vuetable"
			api="residents"
			:fields="fields"
            :formatter="formatter"
            @vuetable:row-clicked="onRowClicked"
		/>
	</div>
</template>

<script>
import orderMixins from "@/mixins/order-mixins";

const fields = [
    { name: "name", title: "姓名" },
    { name: "phoneNum", title: "手机号" },
    { name: "roomNum", title: "房间数" }
].map(field => ({...field, sortField: field.name}));

export default {
    name: "Residents",
    data() {
        return {
            fields
        };
    },
    methods: {
        formatter: res => ({
            data: {
                ...res.data,
                rows: res.data.rows.filter(row => row.name)
            }
        }),
        async onRowClicked ({id}) {
            if (this.editing) return;
            this.id = id;
            const {data: {rooms: data}} = await this.$request({
                url: `residents/${id}`
            });
            this.$vuedals.open({
                title: "住户详情",
                escapable: true,
                props: { data },
                component: {
                    name: "ResidentDetailModal",
                    mixins: [orderMixins],
                    props: ["data"],
                    data() {
                        return {
                            roomFields: [
                                { name: "communityName", title: "小区"},
                                { name: "buildingName", title: "楼栋" },
                                { name: "name", title: "单元号" }
                            ],
                            orderFields: [
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
                    <div>
                        <vuetable 
                            :api-mode="false"
                            :data="data"
                            :fields="roomFields"
                        />
                        <my-vuetable
                            ref="vuetable"
                            api="residents/${id}/orders"
                            :appendParams="status != 0 ? {status} : {}"
                            :fields="orderFields"
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
                    </div>
                    `
                }
            });
        }
    }
};
</script>
