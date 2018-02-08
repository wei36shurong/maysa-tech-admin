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
			<h3> 产品详情 </h3>
		</div>
		<div class="ui vertical segment">
			<table class="ui very basic plain table">
				<tbody>
					<tr> <td>ID</td> <td>{{data.id}}</td> </tr>
					<tr> <td>创建时间</td> <td>{{data.createTime}}</td> </tr>
					<tr> <td>更新时间</td> <td>{{data.updateTime}}</td> </tr>
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
            data: {}
        };
    },
    props: {
        id: Number
    },
    watch: {
        async id(id) {
            // 获取详情
            if (!id) return;
            const { data } = await this.$request({url: `products/${id}`});
            this.data = data;
        }
    },
    methods: {}
};
</script>
