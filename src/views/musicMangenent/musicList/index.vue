<template>
	<div class="container" v-scrollbar>
		<tab-list v-if="showList" @lookFn="csFn" @add="openDialog" ref="tablist"></tab-list>
		<detail v-else-if="!showList" :msg="id" @lookFn="csFn"></detail>
		<Dialog ref="dialog" @refresh="refresh" v-if="showDialog" @close="closeDialog"></Dialog>
	</div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import tabList from "./tabList.vue";
import Detail from "./detail.vue";
import Dialog from "./components/Dialog.vue";
const showList = ref<Boolean>(true);
const showDialog = ref<Boolean>(false);
const dialog = ref<any>();
const tablist = ref<any>();
const id = ref<number>();
const csFn = (val: number) => {
	if (val) {
		if (val != 1212) {
			id.value = val;
		}
		showList.value = false
	} else if (val == null) {
		showList.value = true;
		id.value = 0
	}
}
const openDialog = () => {
	showDialog.value = true
	nextTick(() => {
		dialog.value.showModal();
	})
}
const closeDialog = () => {
	showDialog.value = false;
	nextTick(() => {
		refresh();
	});
}
const refresh = () => {
	nextTick(() => {
		tablist.value.handleSearch();
	});
	
}
</script>