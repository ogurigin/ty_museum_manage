<template>
    <el-config-provider :locale="zhCn" :message="config">
        <router-view />
    </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// import en from 'element-plus/es/locale/lang/en.mjs'
const config = reactive({
  max: 3,
})
</script>
<style>
@import './assets/css/main.css';
@import './assets/css/color-dark.css';
</style>
