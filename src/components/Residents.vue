<style scoped>

</style>

<template>
	<div class="residents">
		<fileupload target="http://localhost:8000/api/upload" action="POST"></fileupload>
	</div>
</template>

<script>
import Vue from "vue";
import DetailRow from "@/components/DetailRow";
import FileUpload from "vue-simple-upload";

Vue.component("my-detail-row", DetailRow);
export default {
    name: "Residents",
    data() {},
    methods: {}
};
</script>
