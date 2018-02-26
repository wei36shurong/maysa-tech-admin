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
                        <td> 
                          <el-time-picker
                            is-range
                            v-model="order.timeRange" />
                        </td>
                    </tr>
					<tr> 
                        <td>故障位置</td>
                        <td>
                            <el-select
                            v-model="order.locationId"
                            filterable>
                                <el-option
                                v-for="location in locations"
                                :key="location.id"
                                :label="location.locationName"
                                :value="location.id" />
                            </el-select>
                        </td>
                    </tr>
					<tr>
                        <td>故障产品</td>
                        <td>
                            <el-select
                            v-model="order.productId"
                            @change="onProductChange"
                            filterable>
                                <el-option
                                v-for="product in products"
                                :key="product.id"
                                :label="product.productName"
                                :value="product.id" />
                            </el-select>
                        </td>
                    </tr>
					<tr> 
                        <td>故障描述</td> 
                        <td>
                            <w-input
                                type="textarea"
                                :rows="2"
                                name="detail"
                                :api="`orders/${id}`"
                                placeholder="请输入故障描述"
                                v-model="order.detail" 
                            />
                        </td>
                    </tr>
					<tr> 
                        <td>工时</td> 
                        <td>
                            <w-input
                                v-model="order.workHours" 
                                :api="`orders/${id}`"
                            />
                        </td>
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
						<!-- <th class="center aligned">头像</th> -->
						<th>姓名</th>
						<th>类型</th>
						<th>等级</th>
						<th>联系方式</th>
						<th></th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(engineer, index) in engineers" :key="`${order.id} ${engineer.id}`">
						<!-- <td class="collapsing">
							<img class="avatar" :src="engineer.avatar">
						</td> -->
						<td>{{engineer.name}}</td>
						<td>{{engineer.type}}</td>
						<td>{{engineer.level}}</td>
						<td>{{engineer.phoneNum}}</td>
						<td>
                            <el-button 
                                :type="engineer.available ? 'success' : 'warning'" 
                                @click="showScheduleModal(engineer.orders)"
                                plain
                            >
                                查看当天时间表
                            </el-button>
                        </td>
						<td class="right aligned ">
							<w-button style="width:100%;"
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
            timeRange: [new Date(), new Date()],
            productId: "",
            products: [],
            locationId: "",
            locations: [],
            order: {
                locationId: null,
                productId: null
            },
            engineers: []
        };
    },
    props: {
        id: Number
    },
    watch: {
        id(id) {
            this.load();
        },
        "order.locationId" () {
            this.loadProducts();
        }
    },
    async created() {
        await this.load();
        await this.loadLocations();
        await this.loadProducts();
    },
    methods: {
        loadProducts() {
            return new Promise(async resolve => {
                const {data: {rows}} = await this.$request({
                    url: `locations/${this.order.locationId}/products`
                });
                this.products = rows;
                // for (const {productName, id} of this.products) {
                //     if (productName === this.order.productName) {
                //         this.productId = id;
                //         break;
                //     }
                // }
                resolve();
            });
        },
        onProductChange(productId) {
            // 在产品变化时，提交信息
            this.$request({
                url: `orders/${this.order.id}`,
                method: "put",
                data: {
                    locationId: this.order.locationId,
                    productId
                }
            });
        },
        loadLocations() {
            return new Promise(async resolve => {
                const {data: {rows}} = await this.$request({
                    url: "locations"
                });
                this.locations = rows;
                // for (const {locationName, id} of this.locations) {
                //     if (locationName === this.order.locationName) {
                //         this.order.locationId = id;
                //         break;
                //     }
                // }
                resolve();
            });
        },
        async load() {
            return new Promise(async resolve => {
                const id = this.id;
                // 获取小区详情
                if (!id) return;
                const {data: order} = await this.$request({
                    url: `orders/${id}`
                });
                console.log(order);
                // const startDate = this.$utils.formatDate(order.startTime);
                // const endDate = this.$utils.formatDate(order.endTime);
                const startTime = this.$utils.formatDate(order.startTime, "LT");
                const endTime = this.$utils.formatDate(order.endTime, "LT");
                // let timeRange = `${startTime} - ${endTime}`;
                // timeRange = startDate === endDate
                //     ? `${startDate} ${timeRange}`
                //     : `${startDate} ${startTime} - ${endDate} ${endTime}`;
                const timeRange = [
                    new Date(order.startTime * 1000),
                    new Date(order.endTime * 1000)
                ];
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
                        let available = true;
                        for (const _order of orders) {
                            const start = _order.appointmentTime;
                            const end = _order.appointmentTime + _order.workHours;
                            if (
                                (start > startTime && start < endTime) ||
                                (end > startTime && end < endTime)
                            ) {
                                available = false;
                                break;
                            }
                        }
                        resolve({
                            ...engineer,
                            orders,
                            available,
                            level: levelMap[engineer.level],
                            isLoading: false
                        });
                    });
                });
                this.engineers = await Promise.all(engineerPromises);
                resolve();
            });
        },
        showImageModal(img) {
            this.$vuedals.open({
                name: "image",
                component: {
                    name: "ImageModal",
                    template: `<img src="${img}">`
                }
            });
        },
        showScheduleModal(orders) {
            const schedule = orders.map(order => {
                // 只显示当前订单时间段内的安排
                // if (appointmentTime < order.startTime) return null;
                // if (appointmentTime > order.endTime) return null;
                //
                const date = this.$utils.formatDate(order.appointmentTime, "lll") || "待定";
                const workHours = order.workHours || "待定";
                // const time = this.$utils.formatDate(appointmentTime, "LT");
                // return today === date ? null : time;
                return { ...order, workHours, date };
            }).sort((a, b) => b.appointmentTime > a.appointmentTime);
            this.$vuedals.open({
                title: "维修人员工作安排",
                name: "schedule",
                props: { schedule },
                component: {
                    name: "ScheduleModal",
                    props: ["schedule"],
                    data() {
                        return {
                            fields: [
                                { name: "date", title: "维修时间"},
                                { name: "communityName", title: "小区"},
                                { name: "buildingName", title: "楼栋" },
                                { name: "roomName", title: "单元号" },
                                { name: "workHours", title: "预计时长"}
                            ]
                        };
                    },
                    template: `
                        <vuetable 
                            :api-mode="false"
                            :data="schedule"
                            :fields="fields"
                        />
                    `
                }
            });
        },
        choose(engineerId, index) {
            return new Promise(async(resolve, reject) => {
                console.log("派单", engineerId);
                const engineer = this.engineers[index];
                const data = { id: engineerId };
                const url = `orders/${this.order.id}/engineers`;
                if (engineer.occupied) {
                    this.$request({url: `${url}/${engineerId}`, data, method: "delete"});
                } else {
                    this.$request({url, data, method: "post"});
                }
                resolve();
            });
        }
    }
};
</script>
