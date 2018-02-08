<template>
	<div
		class="avatar"
		:style="{width: `${size}px`}">
		<img
			v-if="src"
			:src="src"
			:alt="src"
			:style="{
				height: `${size}px`,
				width: `${size}px`,
				border
		}">

		<div
			v-if="!src"
			class="placeholder"
			:style="{
				height: `${size}px`,
				width: `${size}px`,
				backgroundColor: 'rbga(216,216,216,0.2)'
		}"/>

		<span
			class="name"
			v-if="name">
			{{ name }}
		</span>

		<div
			v-if="mask"
			class="mask">
			{{ mask }}
		</div>
	</div>
</template>

<script>
export default {
    name: "Avatar",
    props: {
        border: String,
        src: String,
        name: String,
        size: Number,
        mask: String
    }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/fn";

@xl-size: 170px;
@lg-size: 100px;
@md-size: 50px;
@sm-size: 30px;

.avatar {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: none;
    img {
        // box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.4);
        display: block;
    }
    .placeholder {
        background-color: #b60007;
        // background-color: #d8d8d8;
        // opacity: 0.2;
    }
    // &.xl { width: @xl-size}
    // &.lg { width: @lg-size}
    // &, &.md { width: @md-size}
    // &.sm { width: @sm-size}
    img,
    .placeholder {
        border-radius: 50%;
    }
    &.xl > img,
    &.xl > .placeholder {
        height: @xl-size;
        width: @xl-size;
    }
    &.lg > img,
    &.lg > .placeholder {
        height: @lg-size;
        width: @lg-size;
    }
    img,
    .placeholder,
    &.md > img,
    &.md > .placeholder {
        height: @md-size;
        width: @md-size;
    }
    &.sm > img,
    &.sm > .placeholder {
        height: @sm-size;
        width: @sm-size;
    }

    // TODO
    &.xl > .name {
        margin-top: 24px;
        font-size: 24px;
    }
    &.lg > .name {
        margin-top: 30px;
        font-size: 22px;
    }
    .name,
    &.md > .name {
        margin-top: 4px;
        font-size: 12px;
    }
    &.sm > .name {
        margin-top: 4px;
        font-size: 12px;
    }

    &.selected {
        & > img,
        & > .placeholder {
            border: 2px solid #3bc1e5;
        }
    }
    & > .mask {
        position: absolute;
        color: black;
    }
}
</style>
