<style lang="less" scoped>
@import "~@/assets/less/fn";

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
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
					<tr> 
                        <td>可预约时间段</td>
                        <td> {{order.timeRange}} </td>
                    </tr>
					<tr> <td>故障位置</td> <td>{{order.locationName}}</td> </tr>
					<tr> <td>故障产品</td> <td>{{order.productName}}</td> </tr>
					<tr> 
                        <td>故障描述</td> 
                        <w-input
                        type="textarea"
                        :rows="2"
                        name="detail"
                        :api="`orders/${id}`"
                        placeholder="请输入故障描述"
                        clickable
                        autofocus
                        v-model="order.detail" />
                    </tr>
					<tr> 
                        <td>工时</td> 
                        <w-input v-model="order.workHours" />
                    </tr>
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
						<td>{{engineer.appointmentTimes}}</td>
						<td class="right aligned ">
							<w-button
                                v-model="engineer.occupied"
								:handler="() => choose(engineer.id, index)">
								{{ engineer.occupied ? '取消派单' : '派单' }}
							</w-button>
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
        id(id) {
            this.load();
        }
    },
    created() {
        this.load();
    },
    methods: {
        async load() {
            const id = this.id;
            // 获取小区详情
            if (!id) return;
            const {data: order} = await this.$request({
                url: `orders/${id}`
            });
            console.log(order);
            const startDate = this.$utils.formatDate(order.startTime);
            const endDate = this.$utils.formatDate(order.endTime);
            const startTime = this.$utils.formatDate(order.startTime, "LT");
            const endTime = this.$utils.formatDate(order.endTime, "LT");
            let timeRange = `${startTime} - ${endTime}`;
            timeRange = startDate === endDate
                ? `${startDate} ${timeRange}`
                : `${startDate} ${startTime} - ${endDate} ${endTime}`;
            // TEST 图片mock
            const imgs = [];
            for (let index = 0; index < 3; index++) {
                imgs[index] = `https://api.adorable.io/avatars/1280/${id + index}`;
            }
            this.order = {
                ...order,
                timeRange,
                imgs,
                workHours: order.workHours || 1,
                statusName: statusMap[order.status],
                statusClass: statusColorMap[order.status]
            };

            // 获取小区工程师列表
            const { communityId } = order;
            const { data: { rows: engineers } } = await this.$request({
                url: `communities/${communityId}/engineers?orderId=${id}`
            });

            const engineerPromises = engineers.map(engineer => {
                return new Promise(async (resolve, reject) => {
                    // 获取工程师的工作安排
                    const {data: {rows: orders}} = await this.$request(`engineers/${engineer.id}/orders`);
                    // 处理数据
                    resolve({
                        ...engineer,
                        appointmentTimes: orders.map(_order => {
                            // TODO 早于今天的不显示
                            const date = this.$utils.formatDate(_order.appointmentTime);
                            const time = this.$utils.formatDate(_order.appointmentTime, "LT");
                            const today = this.$utils.formatDate(new Date());
                            return today === date ? null : time;
                        }).filter(item => item).join(","),
                        level: levelMap[engineer.level],
                        isLoading: false
                    });
                });
            });
            this.engineers = await Promise.all(engineerPromises);
        },
        showImageModal(img) {
            this.$vuedals.open({
                dismissable: false,
                name: "image",
                component: {
                    name: "ImageModal",
                    template: `<img src="${img}">`
                }
            });
        },
        choose(engineerId, index) {
            return new Promise(async(resolve, reject) => {
                console.log("派单", engineerId);
                const engineer = this.engineers[index];
                const data = { id: engineerId };
                const url = `orders/${this.order.id}/engineers`;
                const request = engineer.occupied
                    ? this.$request({url: `${url}/${engineerId}`, data, method: "delete"})
                    : this.$request({url, data, method: "post"});
                resolve();
            });
        }
    }
};
</script>
