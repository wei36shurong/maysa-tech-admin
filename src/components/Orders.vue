<style lang="less">
@import "~@/assets/less/fn";

.detail-cell {
    &:extend(.text-ellipsis);
    max-width: 150px;
}
.room-cell { 
    &:extend(.text-ellipsis);
    max-width: 100px; 
}
.status-cell { width: 100px; }
.building-cell { width: 86px; }
</style>

<template>
	<div class="orders">
        <el-menu default-active="0" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="0"> 全部 </el-menu-item>
            <el-menu-item 
            v-for="(status, key) in statusMap"
            :key="status"
            :index="key">
				<i 
                    style="display:inline;"
                    :class="statusColorMap[key]"
                    class="circle icon"/>
                {{status}}
            </el-menu-item>
        </el-menu>
		<my-vuetable
			ref="vuetable"
			api="orders"
            :appendParams="status != 0 ? {status} : {}"
			:fields="fields"
			:formatter="formatter"
            @vuetable:row-clicked="onRowClicked"
        >
			<div
				slot="status"
				slot-scope="{rowData}">
				<i :class="[rowData.statusClass]"
					class="circle icon"/>
				<span> {{rowData.statusName}} </span>
			</div>
		</my-vuetable>
	</div>
</template>

<script>
import orderMixins from "@/mixins/order-mixins";

export default {
    name: "Orders",
    mixins: [orderMixins],
    data() {
        return {
            status: "",
            id: null
        };
    },
    watch: {
        status() {
            this.$nextTick(() => {
                this.$refs.vuetable.reload();
            });
        }
    },
    methods: {
        handleSelect(status) {
            this.status = status;
        }
    }
};
</script>
