<template>
	<div>
		<examine-list v-if="showList" @lookFn="csFn" @open="openDialog" ref="list"></examine-list>
		<Dialog ref="dialog" @refresh="refresh"></Dialog>
	</div>
</template>
<script setup lang='ts'>
import { ref, reactive } from 'vue'
import examineList from './examineList.vue'
import Dialog from './components/Dialog.vue'
const showList = ref<Boolean>(true)
const dialog = ref<any>();
const list = ref<any>();
const csFn = (val: number) => {
	if (val) {
		showList.value = false
	} else {
		showList.value = true
	}
}
const openDialog = (val:string,id: any) => {
	dialog.value.showModal(val,id);
}
const refresh = () =>{
	list.value.handleSearch();
}
</script>
<style lang='less' scoped></style>