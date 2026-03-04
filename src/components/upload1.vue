<template>
    <el-upload v-model:file-list="formInline.pic" action="http://dfs.taoart.com/image.htm" ref="upload"
        list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :limit="1"
        :on-exceed="handleExceed" :on-success="handleUploadSuccess">
        <el-icon>
            <Plus />
        </el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%;height: 400px;" />
    </el-dialog>
</template>
<script setup lang='ts'>
import { ref, reactive, defineExpose,onMounted } from 'vue';
import { toRaw } from "@vue/reactivity";
import { Plus, } from '@element-plus/icons-vue';
import { genFileId } from 'element-plus'
import type { UploadProps, UploadRawFile, UploadInstance, } from 'element-plus';
const props = defineProps({
    index: Number,
    pic:String
})
interface formInline {
    pic: any;
}
let formInline = reactive<formInline>({
    pic: []
});
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const upload = ref<UploadInstance>()
const emit = defineEmits<{
    (event: "uploadSuccess", url: any,index:any): void;
}>();
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles);
    upload.value!.clearFiles();
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}
const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload.value!.handleStart(file)
    upload.value!.submit();
    console.log(upload.value);
}
const handleUploadSuccess: UploadProps['onSuccess'] = (response,
    uploadFile) => {
    // 处理上传成功后的逻辑
    // ...
    console.log(response, props.index);
    emit('uploadSuccess', response.url,props.index);
    // 触发自定义事件
    // emit('upload-success', response, file, fileList);
};
const uploadImg = () => {
    if (formInline.pic[0]) {
        if (formInline.pic[0].response) {
            return formInline.pic[0].response.url
        } else {
            const pic = toRaw(formInline.pic[0])
            return pic.url
        }
    } else {
        return 'err'
    }

}
const returnImg = (res: any) => {
    if (res != '' && res != null) {
        let pic = [];
        if (res != '暂无') {
            pic.push({
                'url': res
            });
        }
        formInline.pic = pic;
    }
}
onMounted(() => {
    console.log(props.index);
    if(props.pic){
        returnImg(props.pic)
    }
})
defineExpose({
    uploadImg,
    returnImg,
    handleUploadSuccess
})
</script>
<style lang='less' scoped></style>