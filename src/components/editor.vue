<template>
	<div class="con">
		<div class="mgb20" ref="editor"></div>
	</div>
</template>

<script setup lang="ts" name="editor">
import WangEditor from 'wangeditor';
import { ref, reactive, onMounted, onBeforeUnmount, defineEmits, defineProps, defineExpose } from 'vue';
const props = withDefaults(defineProps<{
	content: string
}>(), {
	content: ''
})
const editor = ref(null);

const content = reactive({
	html: '',
	text: ''
});
let instance: any;
onMounted(() => {
	instance = new WangEditor(editor.value);
	instance.config.zIndex = 1;
	instance.config.uploadImgServer = 'http://dfs.taoart.com/image.htm'
	instance.config.uploadImgHooks = {
		// 图片上传并返回了结果，想要自己把图片插入到编辑器中
		// 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
		customInsert: function (insertImgFn:any, result:any) {
			// result 即服务端返回的接口
			// insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
			insertImgFn(result.url);
		}
	}
	instance.create();
	content.html = props.content;
});
onUpdated(() => {
	instance.txt.html(props.content);
})
onBeforeUnmount(() => {
	instance.destroy();
	instance = null;
});

const emit = defineEmits<{
	(enevt: 'exportContent', content: any): void
}>()
const syncHTML = () => {
	content.html = instance.txt.html();
	return content.html
};
const onlyRead = ()=>{
	instance.disable();
}
defineExpose({
	syncHTML,
	onlyRead
})
</script>

<style lang="less" scoped>
.con {
	flex: 1;

	.mgb20 {
		width: 100%;
		min-width: 800px;
		img{
			max-width: 300px;
		}
	}
}
</style>
