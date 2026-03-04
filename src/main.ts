import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { forEach } from 'lodash';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import 'element-plus/dist/index.css'
import App from './App.vue';
import router from './router';
import './assets/css/reset.css';
import {QuillEditor} from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import 'virtual:svg-icons-register';
import { usePermissStore } from './store/permiss';
import 'element-plus/dist/index.css';
import svgIcon from './components/svg.vue';
import vue3SeamlessScroll from "vue3-seamless-scroll";
import './assets/css/icon.css';
import API from './api/index';
import 'animate.css/animate.min.css';
import loadMore from './utils/loadmore'
// 引入滚动条组件v3scroll
import scrollbarDirective from './utils/scrollbarDirective'

const mainArr = [] as any
const app = createApp(App);
app.use(router).directive('loadMore', loadMore)
app.use(createPinia());
app.use(vue3SeamlessScroll);
app.use(scrollbarDirective)
// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
//全局挂载
app.config.globalProperties.API = API;
// 自定义权限指令
// const permiss = usePermissStore();
forEach(mainArr,ele => {
    console.log(ele,'ele')
})
app.component('svgIcon', svgIcon);
app.component('QuillEditor',QuillEditor);
app.mount('#app');
