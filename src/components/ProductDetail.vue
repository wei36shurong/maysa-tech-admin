<style lang="less" scoped>
.detail {
    padding: 0 25px;
}
</style>

<template>
	<div class="detail">
		<div class="mheader ui vertical segment">
			<h3 class=""> 产品详情 </h3>
		</div>
		<div class="ui vertical segment">
			<div class="ui middle aligned divided list">
				<div class="item" style="display:flex;align-items:center"
					v-for="location in locations"
					:key="location.id">
					<div class="content" style="flex:1;">
						{{location.locationName}}
					</div>
					<div class="right floated content">
						<div class="ui button">删除</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

export default {
    name: "ProductDetail",
    data() {
        return {
            locations: []
        };
    },
    props: {
        id: {
            type: Number,
            default: 0
        }
    },
    watch: {
        async id(id) {
            // 获取详情
            if (!id) return;
            const {
                data: { rows: locations }
            } = await this.$request({url: `products/${id}`});
            this.locations = locations;
        }
    },
    methods: {}
};
</script>
