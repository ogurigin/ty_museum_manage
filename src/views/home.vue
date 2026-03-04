<template>
	<v-header />
	<v-sidebar />
	<div class="content-box" :class="{ 'content-collapse': sidebar.collapse }">
		<v-tags></v-tags>
		<div class="content">
			<router-view v-slot="{ Component }">
				<transition name="move" mode="out-in">
					<!-- <KeepAlive :include="tags.nameList"> -->
						<component :is="Component"  :key="route.path +new Date()" ></component>
					<!-- </KeepAlive> -->
				</transition>
			</router-view>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useSidebarStore } from '../store/sidebar';
import { useTagsStore } from '../store/tags';
import { useRoute} from "vue-router";
import vHeader from '../components/header.vue';
import vSidebar from '../components/sidebar.vue';
import vTags from '../components/tags.vue';
const route = useRoute();
const sidebar = useSidebarStore();
const tags = useTagsStore();

</script>
