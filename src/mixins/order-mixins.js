import detail from "@/components/OrderDetail";
import { statusMap, statusColorMap } from "@/conf/constants";

const fields = [
    {
        name: "detail",
        title: "故障描述",
        dataClass: "detail-cell"
    }, {
        title: "小区",
        name: "communityName",
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
            statusClass: "red",
            statusName: "待派单",
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
    methods: {
        handleSelect(status) {
            this.status = status;
        },
        onRowClicked({id, status}) {
            this.id = id;
            this.$vuedals.open({
                title: "订单详情",
                header: {
                    props: {
                        statusName: statusMap[status],
                        statusClass: statusColorMap[status]
                    },
                    component: {
                        props: ["statusName", "statusClass"],
                        template: `
                        <div>
                            <h3 style="float:left;"> 订单详情 </h3>
                            <div style="float:right;">
                                <i class="red circle icon" :class="statusClass"/>
                                <span> {{statusName}} </span>
                            </div>
                        </div>
                        `
                    }
                },
                component: detail,
                props: { id: this.id },
                dismissable: false,
                onDismiss: () => {
                    this.$refs.vuetable.reload();
                }
            });
        }
    }
};
