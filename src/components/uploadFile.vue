<template>
  <el-upload v-model:file-list="formInline.file"
    action="http://dfs.taoart.com/image.htm?crossOrigin=http://dfs.taoart.com/crossOrigin.html&dir=alonemedia"
    ref="upload" :on-remove="handleRemove" :limit="1" :on-exceed="handleExceed" :on-success="handleUploadSuccess">
    <el-button size="small" type="primary">选择文件</el-button>
  </el-upload>
</template>
  
<script setup lang="ts">
import { reactive, defineExpose,onMounted } from 'vue';
import { genFileId } from 'element-plus';
import type { UploadProps, UploadRawFile, UploadInstance } from 'element-plus';
const props = defineProps({
  index: Number,
  videoUrl:String
})
interface formInline {
  file: any;
}

const formInline = reactive<formInline>({
  file: []
});

let upload = ref<any>({});
const emit = defineEmits<{
  (event: "uploadSuccessTwo", url: any, index: any): void;
}>();
const handleRemove: UploadProps['onRemove'] = (file) => {
  upload.value?.clearFiles();
};

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value?.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value?.handleStart(file);
  upload.value?.submit();
};
const handleUploadSuccess: UploadProps['onSuccess'] = (response,
  uploadFile) => {
  // 处理上传成功后的逻辑
  // ...
  console.log(response, props.index);
  emit('uploadSuccessTwo', response.url, props.index);
  // 触发自定义事件
  // emit('upload-success', response, file, fileList);
};

const uploadFile = () => {

  const file = formInline.file[0];
  return file?.response?.url || file?.url || 'err';
};

const returnFile = (res: any) => {
  console.log(res);
  if(!res.name){
    formInline.file = [{ url: res,
    name:'文件'
   }];
  }else{
    formInline.file = [{ url: res,
   }];
  }
  
};

onMounted(() => {
    console.log(props.index);
    if(props.videoUrl){
        returnFile(props.videoUrl)
    }
})

defineExpose({
  uploadFile,
  returnFile,
  handleUploadSuccess
});
</script>
  
<style lang="less" scoped></style>