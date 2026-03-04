<template>
	<tabList v-if="showList" @lookFn="csFn" ref="childComponentRef"></tabList>
	<detail v-else-if="!showList" :detailId="detailId" @hided="hided"></detail>
</template>
<script setup lang='ts'>
import { ref } from 'vue'
import tabList from './tabList.vue'
import Detail from './details.vue'
import { log } from 'console'
const showList = ref<Boolean>(true)
const detailId = ref<number>(0)
const pageNum = ref<number>(1)
const childComponentRef = ref<any>()
const csFn = (val: number, Num: number) => {
	pageNum.value = Num
	if (val) {
		showList.value = false
		detailId.value = val
	} else {
		showList.value = true
		detailId.value = 0
	}
}
const hided = () => {
	showList.value = true;
	nextTick(() => {
		childComponentRef.value.getData(pageNum.value);
	})
}
onMounted(() => {
	console.log('初次挂载父组件');
	
	nextTick(() => {
		childComponentRef.value.getData(pageNum.value);
	})
})
</script>
<style lang='less' scoped></style>