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
                <tr> 
                    <td>可上门时间段</td>
                    <td> 
                        <el-time-picker
                        @change="onTimeRangeChange"
                        is-range
                        v-model="order.timeRange" />
                    </td>
                </tr>
                <tr> 
                    <td>上门时间</td> 
                    <td>{{$utils.formatDate(order.appointmentTime)}}</td> 
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
                    <td></td>
                    <td>
                        <template
                            v-for="img in order.orderImgs">
                            <img style="width:120px;height:120px;"
                                @click="showImageModal(img.url)"
                                :key="img.url" :src="img.url">
                            <!-- 图片modal -->
                        </template>
                    </td>
                </tr>
                <tr> 
                    <td>工时</td> 
                    <td>
                        <w-input
                            v-model="order.workTime"
                            :formatter="val => `${val}小时`"
                            placeholder="待定"
                            data-type="number"
                            name="workTime"
                            :api="`orders/${id}`"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
        <el-tabs v-model="activeName" @tab-click="onTabClick">
            <el-tab-pane label="所在小区工程师" name="community">
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
            </el-tab-pane>
            <el-tab-pane label="全部工程师" name="all">
                <my-vuetable
                    :css="{tableClass: 'ui very basic plain table'}"
                    :api-mode="false"
                    :data="formattedAllEngineers"
                    ref="allEngineersVuetable"
                    :per-page="5"
                    :load-on-start="false"
                    @vuetable-pagination:change-page="onChangePage"
                    :api="`engineers?orderId=${id}`"
                    :fields="fields"
                >
                    <el-button 
                        slot="scheduleButton"
                        slot-scope="{rowData}"
                        :type="rowData.available ? 'success' : 'warning'" 
                        @click="showScheduleModal(rowData.orders)"
                        plain
                    >
                        查看当天时间表
                    </el-button>
                    <w-button style="width:100%;"
                        slot="actionButton"
                        slot-scope="{rowData, rowIndex}"
                        v-model="rowData.occupied"
                        :handler="() => choose(rowData.id, rowIndex)">
                        {{ rowData.occupied ? '取消派单' : '派单' }}
                    </w-button>
                </my-vuetable>
            </el-tab-pane>
        </el-tabs>
	</div>
</template>

<script>
import config from "@/conf/config";
import { levelMap, statusMap, statusColorMap } from "@/conf/constants";
export default {
    name: "OrdersDetail",
    components: {},
    data() {
        return {
            config,
            hasLoadAllEngineers: false,
            fields: [
                {name: "name", title: "姓名"},
                {name: "type", title: "类型"},
                {name: "level", title: "等级"},
                {name: "phoneNum", title: "联系方式"},
                {name: "__slot:scheduleButton"},
                {name: "__slot:actionButton"}
            ],
            activeName: "community", // all: 全部工程师, community: 当前小区工程师
            timeRange: [new Date(), new Date()],
            productId: "",
            products: [],
            locationId: "",
            locations: [],
            order: {
                locationId: null,
                productId: null,
                occupied: false, // 是否已经被派给当前订单
                available: true // 是否订单当天是否有空
            },
            allEngineersData: {},
            formattedAllEngineers: {},
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
        async allEngineersData(data) {
            this.$refs.allEngineersVuetable.transform(data);
            this.formattedAllEngineers = {
                data: {
                    ...data.data,
                    rows: await this.engineersDataFormatter(data.data.rows, this.order)
                }
            };
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
        async onChangePage (page) {
            console.log(page);
            this.$refs.allEngineersVuetable.onChangePage(page);
            const data = await this.$request({
                url: `engineers?orderId=${this.order.id}&page=${page}&rows=5`
            });
            this.allEngineersData = data;
        },
        async onTabClick(tab) {
            if (this.hasLoadAllEngineers) return;
            const data = await this.$request({
                url: `engineers?orderId=${this.order.id}&page=1&rows=5`
            });
            this.allEngineersData = data;
            this.hasLoadAllEngineers = true;
        },
        onTimeRangeChange(timeRange) {
            console.log(timeRange);
            const startTime = this.$utils.getTimestamp(timeRange[0]);
            const endTime = this.$utils.getTimestamp(timeRange[1]);
            return new Promise(async resolve => {
                await this.$request({
                    url: `orders/${this.order.id}`,
                    method: "put",
                    data: { startTime, endTime }
                });
                resolve();
            });
        },
        loadProducts() {
            return new Promise(async resolve => {
                const {data: {rows}} = await this.$request({
                    url: `locations/${this.order.locationId}/products`
                });
                this.products = rows;
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
                const timeRange = [
                    this.$utils.getDate(order.startTime),
                    this.$utils.getDate(order.endTime)
                ];
                this.order = {
                    ...this.order,
                    ...order,
                    timeRange,
                    statusName: statusMap[order.status],
                    statusClass: statusColorMap[order.status]
                };

                // 获取小区工程师列表
                const { communityId } = order;
                const { data: { rows: engineers } } = await this.$request({
                    url: `communities/${communityId}/engineers?orderId=${id}`
                });
                this.engineers = await this.engineersDataFormatter(engineers, order);
                resolve();
            });
        },
        engineersDataFormatter(engineers, order) {
            return new Promise(async resolve => {
                const engineerPromises = engineers.map(engineer => {
                    return new Promise(async (resolve, reject) => {
                        // 获取工程师的工作安排
                        // TODO 当天的
                        const {data: {rows: orders}} = await this.$request(`engineers/${engineer.id}/orders?date=${order.startTime}`);
                        // 处理数据
                        let available = true;
                        for (const _order of orders) {
                            const start = _order.appointmentTime;
                            const end = _order.appointmentTime + _order.workTime * 3600;
                            if (
                                (start && end && order.startTime && order.endTime) && // 数据校验
                                (_order.id !== order.id) && ( // 当前订单不记入冲突
                                    start < order.endTime ||
                                    end > order.startTime
                                )
                            ) {
                                console.log("时间冲突的订单", _order);
                                console.log(start, end, order.startTime, order.endTime);
                                console.log(_order.id, order.id, _order.id !== order.id);
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
                const formattedData = await Promise.all(engineerPromises);
                resolve(formattedData);
            });
        },
        showImageModal(src) {
            this.$vuedals.open({
                name: "image",
                size: "lg",
                dismissable: false,
                component: {
                    name: "ImageModal",
                    template: `<img src="${src}">`
                }
            });
        },
        showScheduleModal(orders) {
            const schedule = orders.map(order => {
                const start = this.$utils.formatDate(order.appointmentTime) || "待定";
                const end = start === "待定" ? "待定" : this.$utils.formatDate(order.appointmentTime + order.workTime * 3600);
                // const workTime = order.workTime || "待定";
                return { ...order, start, end };
            }).sort((a, b) => b.appointmentTime > a.appointmentTime);
            this.$vuedals.open({
                title: "维修人员工作安排",
                name: "schedule",
                size: "lg",
                props: { schedule },
                component: {
                    name: "ScheduleModal",
                    props: ["schedule"],
                    data() {
                        return {
                            fields: [
                                { name: "start", title: "开始时间"},
                                { name: "end", title: "结束时间"},
                                { name: "communityName", title: "小区"},
                                { name: "buildingName", title: "楼栋" },
                                { name: "roomName", title: "单元号" }
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
