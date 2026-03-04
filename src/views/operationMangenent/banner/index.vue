<template>
    <banner v-if="showList" msg="你好啊！" @lookFn= "csFn"></banner>
    <detail  :detailId="detailId" v-else-if="!showList" @canFn="canFn"></detail>
</template>
<script setup lang='ts'>
    import {ref,reactive} from 'vue'
    import Banner from './bannerList.vue'
    import Detail from './details.vue'
    const showList = ref<Boolean>(true)
	const detailId = ref<number>(0);
 	const csFn = (val:number) => {
		if(val){
			showList.value  = false
			detailId.value = val
		}else{
			showList.value = true
			detailId.value = 0
		}
 	}
	const canFn = () => {
		showList.value = true
		detailId.value = 0
	} 
</script>
<style lang='less' scoped>
</style>