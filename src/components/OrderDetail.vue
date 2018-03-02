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
        text-align: right;
        &:extend(.text-muted);
    }
    tr > td:nth-child(2) {
        & > div {
            width: 220px;
        }
    }
}
</style>

<template>
	<div class="order-detail">
        <table class="ui very basic plain table detail">
            <thead>
                <tr>
                    <th style="min-width:100px;"></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>编号</td>
                    <td>{{order.code}}</td>
                </tr>
                <tr> <td>小区</td> <td>{{order.communityName}}</td> </tr>
                <tr> <td>楼栋</td> <td>{{order.buildingName}}</td> </tr>
                <tr> <td>单元号</td> <td>{{order.roomName}}</td> </tr>
                <tr> <td>用户名</td> <td>{{order.residentName}}</td> </tr>
                <tr> <td>下单时间</td> <td>{{order.createTime}}</td> </tr>
                <tr> 
                    <td>可上门日期</td>
                    <td>
                        <el-date-picker
                            v-model="order.date"
                            @change="onDateChange"
                            type="date"
                            placeholder="待定" />
                    </td>
                </tr>
                <tr> 
                    <td>可上门时间段</td>
                    <td> 
                        <el-time-select
                            v-model="order.startTime"
                            @change="onTimeRangeChange"
                            :picker-options="{
                                start: '08:30',
                                step: '00:30',
                                end: '21:00'
                            }">
                        </el-time-select>
                        <el-time-select
                            v-model="order.endTime"
                            @change="onTimeRangeChange"
                            :picker-options="{
                                start: '08:30',
                                step: '00:30',
                                end: '21:00',
                                minTime: order.startTime
                            }">
                        </el-time-select>
                        <!-- <el-time-picker
                        is-range
                        :clearable="false"
                        @change="onTimeRangeChange"
                        format="HH:mm"
                        v-model="order.timeRange" /> -->
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
                            style="width:auto;"
                            type="textarea"
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
        <el-tabs
            v-model="activeName"
            @tab-click="onTabClick">
            <el-tab-pane v-if="order.status >= 3" label="该订单派给的工程师" name="orderEngineers">
                <my-vuetable
                    :css="{tableClass: 'ui very basic plain table'}"
                    :api-mode="false"
                    :data="order.engineers"
                    data-path=""
                    ref="orderEngineersVuetable"
                    :per-page="10"
                    :showActions="false"
                    :fields="readOnlyfields"
                >
                    <w-button style="width:100%;"
                        slot="actionButton"
                        slot-scope="{rowData, rowIndex}"
                        v-model="rowData.occupied"
                        :handler="() => choose(rowData, rowIndex)">
                        {{ rowData.occupied ? '取消派单' : '派单' }}
                    </w-button>
                </my-vuetable>
            </el-tab-pane>
            <el-tab-pane v-if="order.status < 3" label="所在小区工程师" name="communityEngineers">
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
                            <td>{{engineer.name}}</td>
                            <td>{{engineer.type}}</td>
                            <td>{{engineer.level}}</td>
                            <td>{{engineer.phoneNum}}</td>
                            <td>
                                <el-button 
                                    :type="engineer.available ? 'success' : 'warning'" 
                                    @click="showScheduleModal(engineer)"
                                    plain
                                >
                                    查看当天时间表
                                </el-button>
                            </td>
                            <td class="right aligned ">
                                <w-button style="width:100%;"
                                    v-model="engineer.occupied"
                                    :handler="() => choose(engineer, index)">
                                    {{ engineer.occupied ? '取消派单' : '派单' }}
                                </w-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </el-tab-pane>
            <el-tab-pane v-if="order.status < 3" label="全部工程师" name="allEngineers">
                <my-vuetable
                    :css="{tableClass: 'ui very basic plain table'}"
                    :api-mode="false"
                    :data="formattedAllEngineers"
                    ref="allEngineersVuetable"
                    :per-page="rows"
                    :load-on-start="false"
                    @vuetable-pagination:change-page="onChangePage"
                    :api="`engineers?orderId=${id}`"
                    :showActions="false"
                    :fields="fields"
                >
                    <el-button 
                        slot="scheduleButton"
                        slot-scope="{rowData}"
                        :type="rowData.available ? 'success' : 'warning'" 
                        @click="showScheduleModal(rowData)"
                        plain
                    >
                        查看当天时间表
                    </el-button>
                    <w-button style="width:100%;"
                        slot="actionButton"
                        slot-scope="{rowData, rowIndex}"
                        v-model="rowData.occupied"
                        :handler="() => choose(rowData, rowIndex)">
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
            rows: 5,
            config,
            hasLoadAllEngineers: false,
            readOnlyfields: [
                {name: "name", title: "姓名"},
                {name: "type", title: "类型"},
                {name: "level", title: "等级"},
                {name: "phoneNum", title: "联系方式"}
            ],
            fields: [
                {name: "name", title: "姓名"},
                {name: "type", title: "类型"},
                {name: "level", title: "等级"},
                {name: "phoneNum", title: "联系方式"},
                {name: "__slot:scheduleButton"},
                {name: "__slot:actionButton"}
            ],
            activeName: "communityEngineers", // all: 全部工程师, community: 当前小区工程师, order: 订单工程师
            productId: "",
            products: [],
            locationId: "",
            locations: [],
            order: {
                timeRange: [],
                engineers: [], // 当前订单派给的工程师
                locationId: null,
                productId: null,
                occupied: false, // 是否已经被派给当前订单
                available: true // 是否订单当天是否有空
            },
            allEngineersData: {},
            formattedAllEngineers: {
                data: { rows: [] }
            },
            engineers: []
        };
    },
    props: {
        id: Number
    },
    computed: {
        formattedCommunityEngineers() {
            const rows = this.formattedAllEngineers.data.rows.filter(engineer => engineer.occupied);
            return rows;
        },
        timeRange() {
            const dateStr = this.$utils.formatDate(this.order.date, "YYYY-MM-DD");
            // 合并，生成新的timeRange
            const startTime = new Date(`${dateStr} ${this.order.startTime}`);
            const endTime = new Date(`${dateStr} ${this.order.endTime}`);
            return [startTime, endTime];
        }
    },
    watch: {
        id(id) {
            this.load();
        },
        async allEngineersData(data) {
            if (!this.$refs.allEngineersVuetable) return [];
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
        this.activeName = this.order.status < 3
            ? "communityEngineers"
            : "orderEngineers";
    },
    methods: {
        async onChangePage (page) {
            this.$refs.allEngineersVuetable.onChangePage(page);
            const data = await this.$request({
                url: `engineers?orderId=${this.order.id}&page=${page}&rows=${this.rows}`
            });
            this.allEngineersData = data;
        },
        async onTabClick(tab) {
            if (this.hasLoadAllEngineers) return;
            const data = await this.$request({
                url: `engineers?orderId=${this.order.id}&page=1&rows=${this.rows}`
            });
            this.allEngineersData = data;
            this.hasLoadAllEngineers = true;
        },
        // 在不修改时间的情况下修改日期，但不提交
        async onDateChange(date) {
            // 获取日期string
            console.log(date);
            const dateStr = this.$utils.formatDate(date, "YYYY-MM-DD");
            // 获取时间string
            console.log(this.order.timeRange);
            const timeRange = this.order.timeRange;
            const startStr = this.$utils.formatDate(timeRange[0], "LT");
            const endStr = this.$utils.formatDate(timeRange[1], "LT");
            // 合并，生成新的timeRange
            const startTime = new Date(`${dateStr} ${startStr}`);
            const endTime = new Date(`${dateStr} ${endStr}`);
            this.order.timeRange = [startTime, endTime];
            this.onTimeRangeChange(this.order.timeRange);
        },
        onTimeRangeChange() {
            const timeRange = this.timeRange;
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
                    startTime: this.$utils.formatDate(order.startTime, "LT"),
                    endTime: this.$utils.formatDate(order.endTime, "LT"),
                    date: this.$utils.getDate(order.startTime),
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
                        const {data: {rows: orders}} = await this.$request(`engineers/${engineer.id}/orders`);
                        // 处理数据
                        let available = true;
                        for (const _order of orders) {
                            const start = _order.appointmentTime;
                            const end = _order.appointmentTime + _order.workTime * 3600;
                            if (
                                (start && end && order.startTime && order.endTime) && // 数据校验
                                (_order.id !== order.id) && !( // 当前订单不记入冲突
                                    end < order.startTime ||
                                    start > order.endTime
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
        async showScheduleModal(engineer) {
            const {data: {rows: orders}} = await this.$request({
                url: `engineers/${engineer.id}/orders`
            });
            const schedule = orders.filter(order => order.appointmentTime).map(order => {
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
                            no-data-template="无安排"
                            :api-mode="false"
                            :data="schedule"
                            :fields="fields"
                        />
                    `
                }
            });
        },
        choose(engineer, index) {
            return new Promise(async(resolve, reject) => {
                console.log("派单", engineer.id);
                const data = { id: engineer.id };
                const order = this.order;
                const url = `orders/${order.id}/engineers`;
                if (engineer.occupied) {
                    this.$request({url: `${url}/${engineer.id}`, data, method: "delete"});
                } else {
                    const date = this.$utils.formatDate(order.date, "YYYY-MM-DD");
                    const address = `${order.communityName} ${order.buildingName} ${order.roomName}`;
                    const content = `您有新的订单，地址：${address}，预约时间段：${date} ${order.startTime}-${order.endTime}，请前往万匠维小程序进行处理`;
                    await this.$request({url, data, method: "post"});
                    await this.$request({
                        url: "message",
                        method: "post",
                        data: {
                            // 【万匠维】您有新的订单，地址：xxxx，预约时间：xxxx，请前往万匠维小程序进行处理
                            mobile: engineer.phoneNum,
                            content
                        }
                    });
                }
                resolve();
            });
        }
    }
};
</script>
