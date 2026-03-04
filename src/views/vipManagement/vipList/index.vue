<template>
    <div>
        <tab-list v-if="showList" @lookFn="csFn" @open="openDialog" ref="Tablist"></tab-list>
        <Dialog ref="dialog" @close="close"></Dialog>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import tabList from "./tabList.vue";
import Dialog from "./components/Dialog.vue"
const showList = ref<Boolean>(true);
const dialog = ref<any>();
const Tablist = ref<any>();
const csFn = (val: number) => {
    if (val) {
        showList.value = false
    } else if (val == null) {
        showList.value = true;
    }
};
const openDialog = (val: string, id: any) => {
    dialog.value.showModal(val);
    if (id != '') {
        dialog.value.getId(id);
    }
}
const close = () => {
    Tablist.value.getData();
}
</script>