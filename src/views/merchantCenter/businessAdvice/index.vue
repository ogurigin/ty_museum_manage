<template>
    <div>
        <tab-list v-if="showList" @lookFn="csFn" @open="openDialog" ref="tablist" @assignment='assignment'></tab-list>
        <Dialog ref="dialog" @refresh="refresh"></Dialog>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import tabList from "./tabList.vue";
import Dialog from "./components/Dialog.vue";
const showList = ref<Boolean>(true);
const dialog = ref<any>();
const tablist = ref<any>();
const csFn = (val: any) => {
    if (val) {
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