const fields = [
    { name: "productName", title: "产品名称" },
    { name: "locationName", title: "所在位置" },
    { name: "createTime", title: "创建时间" },
    {
        name: "updateTime",
        sortField: "updateTime",
        title: "更新时间"
    }
];

export default fields.map(field => {
    field.sortField = field.name;
    return field;
});
