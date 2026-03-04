<template>
    <div>
        <tab-list v-if="showList" @lookFn="csFn" @open="openDialog" ref="tablist" @assignment='assignment'></tab-list>
        <detail v-else-if="!showList" @lookFn="csFn" :msg="id"></detail>
        <Dialog ref="dialog" @refresh="refresh"></Dialog>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import tabList from "./tabList.vue";
import Dialog from "./components/Dialog.vue";
import Detail from "./detail.vue";
const showList = ref<Boolean>(true);
const id = ref<number>();
const dialog = ref<any>();
const tablist = ref<any>();
const csFn = (val: any) => {
    if (val) {
        if (val != 1212) {
            id.value = val;
        }
        showList.value = false
    } else if (val == null) {
        showList.value = true;
    }
};
const openDialog = (val: string) => {
    dialog.value.showModal(val);
}
const refresh = () => {
    tablist.value.handleSearch();
}
const assignment = (val: object) => {
    dialog.value.assignment(val);
}
</script>