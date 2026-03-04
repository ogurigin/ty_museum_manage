<template>
	<tab-list ref="tbL" v-if="showList" msg="你好啊！" @lookFn="csFn"></tab-list>
	<detail :detailId="detailId" v-else-if="!showList" @canFn="canFn"></detail>
</template>
<script setup lang="ts">
import { ref, nextTick } from "vue";
import tabList from "./tabList.vue";
import Detail from "./detail.vue";
const showList = ref<Boolean>(true);
const detailId = ref<number>(0);
const tbL = ref();
const pageNum = ref<number>(1);
const csFn = (val: number, num: number) => {
	pageNum.value = num;
	if (val) {
		showList.value = false
		detailId.value = val
	} else {
		showList.value = true
		detailId.value = 0
	}
}
const canFn = () => {
	showList.value = true
	detailId.value = 0
	nextTick(() => {
		tbL.value.getData(pageNum.value)
	})
}
onMounted(() => {
	nextTick(() => {
		tbL.value.getData(pageNum.value)
	})
})
</script>
