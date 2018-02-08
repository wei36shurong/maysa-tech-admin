<style lang="less" scoped>
.detail {
    padding: 0 25px;
}
.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.mheader {
    display: flex;
    align-items: center;
    // padding-top: 17px;
    // padding-bottom: 20px;
    h3 {
        flex: 1;
        margin: 0;
    }
}
.ui.fullscreen.modal {
    width: auto !important;
}
.ui.modal > .content {
    padding: 0;
}
</style>

<template>
	<div class="detail">
		<div class="mheader ui vertical segment">
			<h3> 工程师详情 </h3>
		</div>
		<div class="ui vertical segment">
			<table class="ui very basic plain table">
				<tbody>
					<tr> <td>头像</td> <td>{{data.avatar}}</td> </tr>
					<tr> <td>姓名</td> <td>{{data.name}}</td> </tr>
					<tr> <td>类型</td> <td>{{data.type}}</td> </tr>
					<tr> <td>等级</td> <td>{{data.level}}</td> </tr>
					<tr> <td>手机</td> <td>{{data.phoneNum}}</td> </tr>
					<tr> <td>创建时间</td> <td>{{data.createTime}}</td> </tr>
					<tr> <td>更新时间</td> <td>{{data.updateTime}}</td> </tr>
				</tbody>
			</table>
			<h4> 分派的订单 </h4>
		</div>
		<div class="ui vertical segment">
			<table class="ui very basic plain table">
				<thead>
					<!-- <th> 编号 </th> -->
					<th> 小区 </th>
					<th> 楼栋 </th>
					<th> 单元号 </th>
					<th> 创建者 </th>
					<!-- <th> 创建时间 </th> -->
					<th> 预约时间 </th>
					<th> 故障位置 </th>
					<th> 故障产品 </th>
					<th> 故障描述 </th>
				</thead>
				<tbody>
					<tr v-for="order in orders" :key="order.id">
						<!-- <td> {{order.code}} </td> -->
						<td> {{order.communityName}} </td>
						<td> {{order.buildingName}} </td>
						<td> {{order.roomName}} </td>
						<td> {{order.residentName}} </td>
						<!-- <td> {{order.createTime}} </td> -->
						<td> {{order.appointmentTime}} </td>
						<td> {{order.locationName}} </td>
						<td> {{order.productName}} </td>
						<td> {{order.detail}} </td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
export default {
    name: "ProductDetail",
    components: {},
    data() {
        return {
            data: {},
            orders: []
        };
    },
    props: {
        id: Number
    },
    watch: {
        async id(id) {
            // 获取详情
            if (!id) return;
            const { data } = await this.$request({url: `engineers/${id}`});
            this.data = data;
            // 获取工程师的订单
            const { data: { rows } } = await this.$request({
                url: `engineers/${id}/orders`
            });
            this.orders = rows;
        }
    },
    methods: {}
};
</script>
