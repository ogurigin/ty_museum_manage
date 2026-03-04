<!---用户头像上传-->
<template>
  <el-upload
    class="avatar-uploader"
    :action="uploadUrl"
    :show-file-list="false"
    accept="png,jpg,jpeg,gif"
    :on-success="handleAvatarSuccess"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref,defineExpose } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
const uploadUrl = 'http://dfs.taoart.com/image.htm'
const imageUrl = ref('')
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = response.url
}
const uploadImg = () => {
  if(imageUrl.value){
    return imageUrl.value
  }else{
    return 'err'
  }
}
const returnImg = (res:string) => {
  if(res !='' && res != null){
    imageUrl.value = res
  }
}
defineExpose(
    {
        uploadImg,
        returnImg 
    }
)
</script>
<style>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  border-radius: 50%;
  display: block;
}
.avatar-uploader .el-upload--text{
       border: 1px dashed var(--el-border-color);
      border-radius: 50% !important;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>