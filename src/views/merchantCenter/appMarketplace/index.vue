<template>
    <div>
        <tab-list @open="openDialog" @assignment="assignment" ref="tablist"></tab-list>
        <Dialog ref="dialog" @refresh="refresh"></Dialog>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import tabList from "./tabList.vue";
import Dialog from "./components/Dialog.vue";
const dialog = ref<any>();
const tablist = ref<any>();
const openDialog = (val: string, id: any) => {
    dialog.value.showModal(val, id);
}
const refresh = () => {
    tablist.value.getData();
}
const assignment = (val: object) => {
    dialog.value.assignment(val);
}
</script>