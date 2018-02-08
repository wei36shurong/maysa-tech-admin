<template>
	<div class="reactive-button">
		<button class="ui primary basic button">
			<span style="position:relative;">
				<slot> 提交 </slot>
				<x-icon class="x-icon loader" type="load-c" v-show="showWaitingIcon"></x-icon>
				<x-icon class="x-icon" type="checkmark" v-show="showSuccessIcon"></x-icon>
				<x-icon class="x-icon" type="alert" v-show="showFailIcon"></x-icon>
			</span>
		</button>
	</div>
</template>

<script>
export default {
    name: "ReactiveButton",
    created() {
        this.currentStatus = this.submitStatus;
        this.$on("minWaitingTimePassed", () => {
            this.currentStatus = this.submitStatus;
            // reset
            this.hasPassMinWaitingTime = false;
        });
    },
    props: {
        type: {
            type: String,
            default: "primary"
        },
        submitStatus: {
            type: String,
            default: "pending" // pending, waiting, success, fail
        },
        minWaitingTime: {
            type: Number,
            default: 1500
        }
    },
    data() {
        return {
            currentStatus: "pending", // pending, waiting, success, fail
            hasPassMinWaitingTime: false
        };
    },
    watch: {
        submitStatus(newVal, oldVal) {
            if (newVal === "waiting") {
                setTimeout(() => {
                    this.hasPassMinWaitingTime = true;
                }, this.minWaitingTime);
            }
            if (oldVal === "waiting") {
                if (this.hasPassMinWaitingTime) {
                    this.currentStatus = newVal;
                }
            } else {
                this.currentStatus = newVal;
            }
        },
        currentStatus(val) {
            switch (val) {
                case "success":
                    this.$emit("success");
                    break;
                case "fail":
                    this.$emit("fail");
                    break;
            }
        },
        hasPassMinWaitingTime(newVal) {
            if (!newVal) return;
            this.$emit("minWaitingTimePassed");
        }
    },
    computed: {
        showWaitingIcon() {
            return this.currentStatus === "waiting";
        },
        showSuccessIcon() {
            return this.currentStatus === "success";
        },
        showFailIcon() {
            return this.currentStatus === "fail";
        }
    },
    methods: {}
};
</script>

<style lang="less">
.x-icon {
    position: absolute;
    top: 0;
    vertical-align: middle;
    fill: white;
}
.loader {
    animation: spin 1.5s cubic-bezier(0.8, 0, 0.2, 1) infinite;
}
@keyframes spin {
    0% {
        transform: rotate(-90deg);
    }
    100% {
        transform: rotate(270deg);
    }
}
</style>
