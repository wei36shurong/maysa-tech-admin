const fields = [
    { name: "avatar", title: "头像" },
    { name: "name", title: "姓名" },
    { name: "communityName", title: "所在小区" },
    { name: "type", title: "类型" },
    { name: "level", title: "等级" },
    { name: "phoneNum", title: "电话" },
    { name: "createTime", title: "创建时间" },
    { name: "updateTime", title: "更新时间" }
];

export default fields.map(field => {
    field.sortField = field.name;
    return field;
});
