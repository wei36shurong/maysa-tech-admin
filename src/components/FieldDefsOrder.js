const fields = [
    { name: "code", title: "订单编号" },
    { name: "detail", title: "故障描述" },
    { name: "communityName", title: "小区" },
    { name: "buildingName", title: "楼栋" },
    { name: "roomName", title: "单元号" },
    { name: "createTime", title: "创建时间" },
    { name: "updateTime", title: "更新时间" }
];

export default fields.map(field => {
    field.sortField = field.name;
    return field;
});
