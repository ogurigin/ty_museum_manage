<template>
	<el-form :model="creatorInfo" class="container" v-if="show" label-width="120px">
       <el-form-item label="图片" style="width: 720px;">
          <!-- <upload-lun ref="uploadImgRef" class="uploadCont"></upload-lun> -->
           <el-upload v-model:file-list="creatorInfo.logUrlArr" action="http://dfs.taoart.com/image.htm" ref="uploadImgRef"
              list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :limit="1"
              :on-exceed="handleExceed" :disabled="disabled">

          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-dialog v-model="dialogImgVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="创作者名称">
        <el-input v-model="creatorInfo.name" placeholder="请输入创作者名称" :disabled="disabled"> </el-input>

      </el-form-item>
      <el-form-item label="创作者简介">
        <el-input v-model="creatorInfo.profile" type="textarea" placeholder="请输入创作者简介" style="width: 720px;" :disabled="disabled"> </el-input>
      </el-form-item>
    <div class="videoInput" style="justify-content: flex-end;">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="saveEdit()" v-if="!disabled">确定</el-button>

    </div>
    </el-form>
  </template>
    
  <script setup lang="ts">
  import { ref, reactive } from "vue";
  import { genFileId, ElMessage, ElMessageBox, } from 'element-plus'
  import type { UploadProps, UploadRawFile, } from 'element-plus'
  import { forEach, } from "lodash";
  const { proxy } = getCurrentInstance() as any;
  interface creatorInfo {
    id?: string;
    name: string;
    logUrl: string;
    logUrlArr:any;
    profile: string;
  }
  //供应链基本信息
  let creatorInfo = reactive<creatorInfo>({
    id: "",
    name: "",
    logUrl: "",
    profile: '',
    logUrlArr:[],
  });
  // 详情
  const getCreatorDel = async (id:number)=>{
    const {data} = await proxy.API.getCreatorDel({id})
    creatorInfo.logUrl = data.result.logUrl??'';
    const arr = data.result.logUrl.split(',');
    creatorInfo.logUrlArr = arr.map((item:any)=>{
      return {
        url: item,
        name: item.split('/').pop(),
      }
    })
    // creatorInfo.logUrlArr = data.result.logUrl.split(',');
    creatorInfo.name = data.result.name??'';
    creatorInfo.profile = data.result.profile??'';
    creatorInfo.id = data.result.id??'';
  }

  const show = ref(false);
 const enterpriseId = ref();
 const disabled = ref(false);

  const init =async (id?:number,type?:number)=>{
    show.value = true;
    if(type === 1){
      disabled.value = true;
    }
    if(id){
       enterpriseId.value = id??'';
       getCreatorDel(id);
    }
  }
  defineExpose({init});


  // 上传图片
const uploadImgRef = ref(null) as any
const dialogImageUrl = ref('')
const dialogImgVisible = ref(false)
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  uploadImgRef.value!.clearFiles();
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogImgVisible.value = true
}
const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadImgRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadImgRef.value!.handleStart(file)
  uploadImgRef.value!.submit();
}


const saveEdit = async() => {
  if(!creatorInfo.name){
    ElMessage.warning('请输入名称！')
    return;
  }
  if(!creatorInfo.profile){
    ElMessage.warning('请输入简介！')
    return;
  }
if(!creatorInfo.logUrlArr.length){
    ElMessage.warning('请上传图片！')
    return;
  }
  const urls = creatorInfo.logUrlArr.map((item:any)=>{
    if(item.response){
      return item.response.url;
    }
    return item.url;
  })
  creatorInfo.logUrl = urls.join(',');
  if (creatorInfo.id !== '') {
    updateCreator();
  } else {
    addCreator();
  }
}

 const emit = defineEmits(['open' ])
  const cancel = () => {
    show.value = false
    emit("open");
  };


  //新增
const addCreator = () => {
  let params = {
    ...creatorInfo,
    // picUrl: passCardInfo.picUrl[0].response.url
  };
  proxy.API.insertCreator(params).then((res: any) => {
    ElMessage.success('新建成功');
    // 刷新下拉列表
    // proxy.$refs.creatorList.getCreatorAll();
    cancel();
  });
};

//更新展览交流详情
const updateCreator = () => {
  let params = {
    ...creatorInfo,
    // pic: pic,
  };

  proxy.API.updateCreator(params).then((res: any) => {
    ElMessage.success('修改成功');
    cancel();
  });
}
  
  

  </script>
    
  <style lang="less" scoped>
  .videoInput {
    display: flex;
    margin-top: 40px;
    margin-left: 40px;
    margin-right: 40px;
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .el-form-item {
    width: 480px;
    min-height: 60px;
    display: flex;
    margin-left: 40px;
    flex-direction: row;
    margin-top: 20px;
    align-items: center;
  }
  
  .require {
    color: red;
  }
  
  .videoInp .text {
    min-width: 90px;
  }
  
  .editor {
    width: 800px;
    height: auto;
  }
  </style>