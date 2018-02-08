<style lang="less" scoped>
@import "~@/assets/less/fn";

.order-detail {
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
.detail.table {
    tr > td:first-child {
        &:extend(.text-muted);
    }
}
</style>

<template>
	<div class="order-detail">
		<div class="mheader ui vertical segment">
			<h3> 订单详情 </h3>
			<div>
				<i :class="[order.statusClass]"
					class="circle icon"/>
				<span> {{order.statusName}} </span>
			</div>
		</div>
		<div class="ui vertical segment">
			<table class="ui very basic plain table detail">
				<tbody>
					<tr>
                        <td>编号</td>
                        <td>{{order.code}}</td>
                    </tr>
					<tr> <td>小区</td> <td>{{order.communityName}}</td> </tr>
					<tr> <td>楼栋</td> <td>{{order.buildingName}}</td> </tr>
					<tr> <td>单元号</td> <td>{{order.roomName}}</td> </tr>
					<tr> <td>创建者</td> <td>{{order.residentName}}</td> </tr>
					<tr> <td>创建时间</td> <td>{{order.createTime}}</td> </tr>
					<tr> <td>预约时间</td> <td>{{order.appointmentTime}}</td> </tr>
					<tr> <td>故障位置</td> <td>{{order.locationName}}</td> </tr>
					<tr> <td>故障产品</td> <td>{{order.productName}}</td> </tr>
					<tr> <td>故障描述</td> <td>{{order.detail}}</td> </tr>
					<tr>
						<td></td>
						<td>
							<template
								v-for="img in order.imgs"
								:src="img">
								<img style="width:120px;height:120px;"
									@click="showImageModal(img)"
									:key="img" :src="img">
								<!-- 图片modal -->
								<div class="ui fullscreen modal" v-bind:data-url="img" :key="img + '-modal'">
									<i class="close icon" />
									<div class="image content">
										<img class="image" :src="img">
									</div>
								</div>
							</template>
						</td>
					</tr>
				</tbody>
			</table>
			<h4> 维修人员 </h4>
		</div>
		<div class="ui vertical segment">
			<table class="ui very basic plain table">
				<thead>
					<tr>
						<th class="center aligned">头像</th>
						<th>姓名</th>
						<th>类型</th>
						<th>等级</th>
						<th>联系方式</th>
						<th class="six wide"></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(engineer, index) in engineers" :key="`${order.id} ${engineer.id}`">
						<td class="collapsing">
							<img class="avatar" :src="engineer.avatar">
						</td>
						<td>{{engineer.name}}</td>
						<td>{{engineer.type}}</td>
						<td>{{engineer.level}}</td>
						<td>{{engineer.phoneNum}}</td>
						<td class="right aligned ">
							<button
								class="ui primary button"
								:class="{
									disabled: engineer.isLoading,
									loading: engineer.isLoading,
									basic: !engineer.occupied
								}"
								@click="choose(engineer.id, index)">
								{{ engineer.occupied ? '取消派单' : '派单' }}
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import { levelMap, statusMap, statusColorMap } from "@/conf/constants";
export default {
    name: "OrdersDetail",
    components: {},
    data() {
        return {
            order: {},
            engineers: []
        };
    },
    props: {
        id: Number
    },
    watch: {
        async id(id) {
            // 获取小区详情
            if (!id) return;
            const {data: order} = await this.$request({
                url: `orders/${id}`
            });
            console.log(order);
            this.order = {
                ...order,
                statusName: statusMap[order.status],
                statusClass: statusColorMap[order.status]
            };

            // 获取小区工程师列表
            const { communityId } = order;
            const { data: { rows: engineers } } = await this.$request({
                url: `communities/${communityId}/engineers?orderId=${id}`
            });

            // 处理数据
            this.engineers = engineers.map(engineer => ({
                ...engineer,
                level: levelMap[engineer.level],
                isLoading: false
            }));
        }
    },
    methods: {
        showImageModal(img) {
            console.log("showImageModal");
            const modal = $(`.ui.modal[data-url='${img}']`).modal({
                allowMultiple: true
            });
            console.log(modal);
            modal.modal("show");
        },
        async choose(engineerId, index) {
            console.log("派单", engineerId);

            const engineer = this.engineers[index];
            const data = { id: engineerId };
            const url = `orders/${this.order.id}/engineers`;
            const request = engineer.occupied
                ? this.$request({url: `${url}/${engineerId}`, data, method: "delete"})
                : this.$request({url, data, method: "post"});

            // 开始请求，少于1秒等1秒后再返回。
            engineer.isLoading = true;
            await Promise.all([
                request,
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                })
            ]);
            engineer.isLoading = false;
            engineer.occupied = !engineer.occupied;
        }
    }
};
</script>
