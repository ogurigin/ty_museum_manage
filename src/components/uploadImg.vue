<template>
	<el-upload v-model:file-list="formInline.pic" action="http://dfs.taoart.com/image.htm" ref="upload"
		list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :limit="9">
		<el-icon>
		  <Plus />
		</el-icon>
	</el-upload>
	<el-dialog v-model="dialogVisible">
		<img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%;height: 400px;" />
	</el-dialog>
</template>
<script setup lang='ts'>
import {ref,reactive,defineExpose} from 'vue';
import { toRaw } from "@vue/reactivity";
import { Plus, } from '@element-plus/icons-vue';
import type { UploadProps, UploadRawFile, UploadInstance, } from 'element-plus';
interface formInline {
	pic: any;
}
let formInline = reactive<formInline>({
	pic: []
});
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const upload = ref<UploadInstance>()
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
	let arr = [] as any
	for(let index in formInline.pic){
		if(formInline.pic[index].url != uploadFile.url ){
			arr.push(formInline.pic[index])
		}
	}
	formInline.pic = [...arr]
}
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
	dialogImageUrl.value = uploadFile.url!
	dialogVisible.value = true
}
const uploadImg = () => {
	formInline = toRaw(formInline)
	for(let index in formInline.pic){
		if(formInline.pic[index].response){
			formInline.pic[index] = {
				url:formInline.pic[index].response.url
			}
		}
	}
	if(formInline.pic.length){
		return formInline.pic
	}else{
		return 'err'
	}
}
const returnImg = (res:any) => {
	if(res != '' && res !=null){
		formInline.pic = res;
	}
}
defineExpose({
	uploadImg,
	returnImg 
})
</script>
<style lang='less' scoped>
</style>