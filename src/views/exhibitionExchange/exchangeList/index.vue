<template>
	<div class="container" v-scrollbar>
		<tab-list v-if="showList" @lookFn="csFn"></tab-list>
		<detail v-else-if="!showList" @lookFn="csFn" :msg="id"></detail>
	</div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import tabList from "./tabList.vue";
import Detail from "./detail.vue";
const showList = ref<Boolean>(true);
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
</script>