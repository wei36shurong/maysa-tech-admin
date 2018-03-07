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
                title: "住户房间列表",
                escapable: true,
                props: { data },
                component: {
                    name: "ResidentDetailModal",
                    props: ["data"],
                    data() {
                        return {
                            fields: [
                                { name: "communityName", title: "小区"},
                                { name: "buildingName", title: "楼栋" },
                                { name: "name", title: "单元号" }
                            ]
                        };
                    },
                    template: `
                        <vuetable 
                            :api-mode="false"
                            :data="data"
                            :fields="fields"
                        />
                    `
                }
            });
        }
    }
};
</script>
