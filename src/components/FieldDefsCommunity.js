const fields = [
    { name: "communityName", title: "小区名称" },
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
