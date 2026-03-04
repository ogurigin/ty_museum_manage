<template>
	<el-form :model="passCardInfo" class="container" v-if="show" label-width="120px">


      <el-form-item label="卡片名称">
        <el-input v-model="passCardInfo.name" placeholder="请输入卡片名称" :disabled="disabled"> </el-input>
      </el-form-item>
       <el-form-item label="卡片编号">
        <el-input v-model="passCardInfo.nfcId" placeholder="请输入卡片编号" :disabled="disabled"> </el-input>
      </el-form-item>
      <el-form-item label="讲解词">
        <el-input v-model="passCardInfo.explainWord" type="textarea" placeholder="请输入讲解词" style="width: 720px;" :disabled="disabled"> </el-input>

      </el-form-item>
       <el-form-item label="讲解词音频">
        <el-upload class="upload-demo" style="width: 480px;"
            accept=".mp3,.wav"
            :auto-upload="true" ref="uploadAudioRef" :limit="1" 
            :http-request="uploadAudio"
              :before-upload="beforeAudioUpload"

            :on-exceed="handleExceedAudio"
            v-model:file-list="passCardInfo.explainAudioArr" :on-success="handleAndioSuccess"

            :on-remove="handleRemoveAudio">
            <el-button size="small" type="primary">上传音频</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="模型地址">
        <el-input v-model="passCardInfo.modelUrl" placeholder="请输入模型地址" style="width: 720px;" :disabled="disabled"> </el-input>

      </el-form-item>
      <el-form-item label="视频">
        <el-upload class="upload-demo" style="width: 480px;"
            accept=".mp4,.avi,.mov"
            :auto-upload="true" ref="uploadVedioRef" :limit="1" 
            :http-request="uploadVedio"
            :on-exceed="handleExceedVedio"
              :before-upload="beforeVedioUpload"
            v-model:file-list="passCardInfo.videoUrlArr" :on-success="handleVedioSuccess"
            :on-remove="handleRemoveVedio">
            <el-button size="small" type="primary" :disabled="disabled">上传视频</el-button>

        </el-upload>
      </el-form-item>
       <el-form-item label="图片" style="width: 720px;">
           <!-- <upload-lun ref="uploadImgRef" class="uploadCont"></upload-lun> -->
             <el-upload v-model:file-list="passCardInfo.picUrlArr" action="http://dfs.taoart.com/image.htm" ref="uploadImgRef"
              list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :limit="9"
              :on-exceed="handleExceed" :disabled="disabled">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogImgVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
      </el-form-item>
      <el-form-item label="卡片图样">
        <el-upload
          v-model:file-list="passCardInfo.demoPicUrlArr"
          action="http://dfs.taoart.com/image.htm"
          ref="uploadDemoPicRef"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemoveDemoPic"
          :limit="1"
          :on-exceed="handleExceedDemoPic"
          :on-success="handleDemoPicSuccess"
          :disabled="disabled"
        >
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="领取地址">
        <div>
          <el-upload
            v-model:file-list="passCardInfo.addressPicUrlArr"
            action="http://dfs.taoart.com/image.htm"
            ref="uploadAddressPicRef"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemoveAddressPic"
            :limit="1"
            :on-exceed="handleExceedAddressPic"
            :before-upload="beforeAddressUpload"
            :on-success="handleAddressPicSuccess"
            :disabled="disabled"
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
          <div style="color: #909399; font-size: 12px; line-height: 1; margin-top: 8px;">图片尺寸：600*210px</div>
        </div>
      </el-form-item>
      <el-form-item label="创作者" >
        <div style="display: flex; align-items: center;"> 
        <el-select 
            v-model="passCardInfo.enterpriseId" 
            placeholder="请选择"  
            :teleported="false" 
            remote :disabled="disabled"
            filterable

            style="width: 480px"
          >
          <el-option v-for="item in creatorList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <!-- <el-button @click="handleAddCreator()" type="text" style="margin-left: 20px;" v-if="!disabled">没找到？去新建创作者</el-button> -->
        </div>
      </el-form-item>
    <div class="videoInput" style="justify-content: flex-end;" >
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="saveEdit()" :disabled="disabled">确定</el-button>


    </div>
    </el-form>
  </template>
    
  <script setup lang="ts">
  import { ref, reactive, } from "vue";
  import { genFileId, ElMessage, ElMessageBox, } from 'element-plus'
  import type { UploadProps, UploadRawFile, UploadInstance,UploadRequestHandler } from 'element-plus'
import router from "@/router";
  const { proxy } = getCurrentInstance() as any;
  interface passCardInfo {
    id?: string;
    name: string;
    explainWord: string;
    explainAudio: string;
    modelUrl: string
    videoUrl: string;
    picUrl: any;
    picUrlArr: any;
    enterpriseId: string;
    explainAudioArr: any[];
    videoUrlArr: any[];
    nfcId: string;
    demoPicUrl: string;
    addressPicUrl: string;
    demoPicUrlArr: any[];
    addressPicUrlArr: any[];


  }
  //pass卡信息
  let passCardInfo = reactive<passCardInfo>({
    id: "",
    name: "",
    explainWord: "",
    explainAudio: "",
    modelUrl: "",
    videoUrl: "",
    picUrl: "",
    picUrlArr:[],
    enterpriseId: "",
    nfcId: "",

    explainAudioArr: [],
    videoUrlArr: [],
    demoPicUrl: "",
    addressPicUrl: "",
    demoPicUrlArr: [],
    addressPicUrlArr: [],

  });
  /* 创作者选择 */
  const creatorList = ref<any[]>([]);
  const getCreatorList = async ()=>{
   const res =await proxy.API.getCreatorAll();
	creatorList.value = res.data.result;
  }

  // 详情
  const getPasscardDel = async (id:number)=>{
    const {data} = await proxy.API.getPasscardDel({id});
    const {result} = data;
    if(result.explainAudio){
      passCardInfo.explainAudioArr = [{
          url: result.explainAudio,
          name: result.explainAudio.split('/').pop(),
      }]
    }
    if(result.videoUrl){
      passCardInfo.videoUrlArr = [{
          url: result.videoUrl,
          name: result.videoUrl.split('/').pop(),
      }]
    }
    if(result.demoPicUrl){
      passCardInfo.demoPicUrlArr = [{
        url: result.demoPicUrl,
        name: result.demoPicUrl.split('/').pop(),
      }]
    }
    if(result.addressPicUrl){
      passCardInfo.addressPicUrlArr = [{
        url: result.addressPicUrl,
        name: result.addressPicUrl.split('/').pop(),
      }]
    }
    const arr = result.picUrl.split(',');
    passCardInfo.picUrlArr = arr.map((item:any)=>{
      return {
        url: item,
        name: item.split('/').pop(),
      }
    })
    passCardInfo.enterpriseId = result.enterpriseId??'';
    passCardInfo.name = result.name??'';
    passCardInfo.explainWord = result.explainWord??'';
    passCardInfo.modelUrl = result.modelUrl??'';
    passCardInfo.id = result.id??'';
    passCardInfo.nfcId = result.nfcId??'';
    passCardInfo.videoUrl = result.videoUrl??'';
    passCardInfo.explainAudio = result.explainAudio??'';
    passCardInfo.demoPicUrl = result.demoPicUrl??'';
    passCardInfo.addressPicUrl = result.addressPicUrl??'';
  }

  // 上传请求  音频
const uploadAudioRef = ref();
const uploadAudio:UploadRequestHandler =async (params)=>{
  const paramsData = new FormData();
  paramsData.append('file',  params.file)
  const {data} = await proxy.API.saveAntiqueFile(paramsData)
  passCardInfo.explainAudio = data.result;
}
const handleExceedAudio: UploadProps['onExceed'] = (files) => {
    
    uploadAudioRef.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadAudioRef.value!.handleStart(file);
    uploadAudioRef.value!.submit();
}
const beforeAudioUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 25) {
    ElMessage.error('音频最大大小为25M!')
    return false
  }
  return true
}

const handleAndioSuccess: UploadProps['onSuccess'] = (response: any) => {
  passCardInfo.explainAudio = response.url;
}
const handleRemoveAudio: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    uploadAudioRef.value!.clearFiles();
    passCardInfo.explainAudio = '';
}

// 上传请求  视频
const uploadVedioRef = ref();
const uploadVedio:UploadRequestHandler =async (params)=>{
  const paramsData = new FormData();
  paramsData.append('file',  params.file)
  const {data} = await proxy.API.saveAntiqueFile(paramsData)
  passCardInfo.videoUrl = data.result;
}
const handleExceedVedio: UploadProps['onExceed'] = (files) => {
    uploadVedioRef.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadVedioRef.value!.handleStart(file);
    uploadVedioRef.value!.submit();
}
const beforeVedioUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 25) {
    ElMessage.error('视频最大大小为25M!')
    return false
  }
  return true
}

const handleVedioSuccess: UploadProps['onSuccess'] = (response: any) => {
  passCardInfo.videoUrl = response.url;
}
const handleRemoveVedio: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    uploadVedioRef.value!.clearFiles();
    passCardInfo.videoUrl = '';
}
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

const uploadDemoPicRef = ref() as any
const handleExceedDemoPic: UploadProps['onExceed'] = (files) => {
  uploadDemoPicRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadDemoPicRef.value!.handleStart(file)
  uploadDemoPicRef.value!.submit();
}
const handleRemoveDemoPic: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  uploadDemoPicRef.value!.clearFiles();
  passCardInfo.demoPicUrl = '';
}
const uploadAddressPicRef = ref() as any
const handleExceedAddressPic: UploadProps['onExceed'] = (files) => {
  uploadAddressPicRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadAddressPicRef.value!.handleStart(file)
  uploadAddressPicRef.value!.submit();
}
const handleRemoveAddressPic: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  uploadAddressPicRef.value!.clearFiles();
  passCardInfo.addressPicUrl = '';
}
const handleDemoPicSuccess: UploadProps['onSuccess'] = (response: any) => {
  passCardInfo.demoPicUrl = response.url;
}
const handleAddressPicSuccess: UploadProps['onSuccess'] = (response: any) => {
  passCardInfo.addressPicUrl = response.url;
}
const beforeAddressUpload: UploadProps['beforeUpload'] = async (rawFile) => {
  const isImage = rawFile.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('请上传图片文件')
    return false
  }
  const objectUrl = URL.createObjectURL(rawFile)
  const img: HTMLImageElement = await new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = objectUrl
  })
  URL.revokeObjectURL(objectUrl)
  if (img.naturalWidth !== 600 || img.naturalHeight !== 210) {
    ElMessage.error('图片尺寸需为600*210px')
    return false
  }
  return true
}

// 上传图片
const saveEdit = async() => {
  if(!passCardInfo.name){
    ElMessage.warning('请输入名称！')
    return;
  }
  if(!passCardInfo.nfcId){
    ElMessage.warning('请输入卡片编号！')
    return;
  }

  if(!passCardInfo.explainWord){
    ElMessage.warning('请输入说明！')
    return;
  }
	if(!passCardInfo.picUrlArr.length){
    ElMessage.warning('请上传图片！')
    return;
  }
  const urls = passCardInfo.picUrlArr.map((item:any)=>{
    if(item.response){
      return item.response.url;
    }
    return item.url;
  })
  passCardInfo.picUrl = urls.join(',');
  if(passCardInfo.demoPicUrlArr && passCardInfo.demoPicUrlArr.length){
    const f = passCardInfo.demoPicUrlArr[0]
    passCardInfo.demoPicUrl = f.response ? f.response.url : f.url
  }
  if(passCardInfo.addressPicUrlArr && passCardInfo.addressPicUrlArr.length){
    const f = passCardInfo.addressPicUrlArr[0]
    passCardInfo.addressPicUrl = f.response ? f.response.url : f.url
  }
  if (passCardInfo.id !== '') {
    updatePassCard();
  } else {
    addPassCard();
  }
}


  const show = ref(false);
 const passCardId = ref();
 const disabled = ref(false);
  const init =async (id?:number,type?:number)=>{
    if(type === 1){
      disabled.value = true;
    }

    show.value = true;
    if(id){
       passCardId.value = id??'';
       getPasscardDel(id);
    }
    getCreatorList();
  }
  defineExpose({init});


  
  const emit = defineEmits(['open'])
  const cancel = () => {
    show.value = false
    emit("open");
  };



  //新增
const addPassCard = () => {
  let params = {
    ...passCardInfo,
    // picUrl: passCardInfo.picUrl[0].response.url
  };
  proxy.API.insertPasscard(params).then((res: any) => {
    ElMessage.success('新建成功');
    cancel();
  });
};

  //更新展览交流详情
  const updatePassCard = () => {
    let params = {
      ...passCardInfo,
      // pic: pic,
    };
  
    proxy.API.updatePasscard(params).then((res: any) => {
      ElMessage.success('修改成功');
      cancel();
    });
  }
  const handleAddCreator = ()=>{
    router.push({
      path: '/creatorList',
      query: {
        type: 'add'
      }
    })
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
