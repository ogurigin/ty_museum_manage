<template>
	<tab-list ref="tabL" v-if="showList" @lookFn="csFn"></tab-list>
	<detail :detailId="detailId" v-else-if="!showList" @canFn="canFn"></detail>
</template>
<script setup lang="ts">
import { ref } from "vue";
import tabList from "./tabList.vue";
import Detail from "./detail.vue";
const showList = ref<Boolean>(true);
const detailId = ref<number>(0);
const tabL = ref();
const pageNum = ref<number>(1);
const csFn = (val: number, num: number) => {
	pageNum.value = num;
	if (val) {
		detailId.value = val
		showList.value = false
	} else {
		detailId.value = 0
		showList.value = true
	}
}
const canFn = () => {
	showList.value = true;
	nextTick(() => {
		tabL.value.getData(pageNum.value)
	})
}
onMounted(() => {
	nextTick(() => {
		tabL.value.getData(pageNum.value)
	})
})
</script>