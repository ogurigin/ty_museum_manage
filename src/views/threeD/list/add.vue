<template>
	<div class="container" v-if="show">
    <div class="videoInput">
      <div class="videoInp">
        <div class="text"><span class="require">*</span>文物标题</div>
        <el-input v-model="antiqueInfo.name" placeholder="请输入文物标题"></el-input>
      </div>
      <div class="videoInp">
        <div class="text"><span class="require">*</span>文物分类</div>
        <el-select 
            v-model="antiqueInfo.type" 
            placeholder="请选择"  
            :teleported="false" 
            filterable 
            remote 
            v-loadMore="loadTabsMore(9)"
          >
          <el-option v-for="item in options.typeOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="videoInp" style="width: 100%">
        <div class="text"><span class="require">*</span>所属场馆</div>
        <el-select 
            v-model="antiqueInfo.venueId" 
            placeholder="请选择"  
            :teleported="false" 
            filterable 
            remote 
            v-loadMore="loadVenueMore"
            :remote-method="getVenueOptions"
            style="width: 720px"
          >
          <el-option v-for="item in venueOptions" :key="item.id" :label="item.enterpriseName" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <!-- <div class="videoInp">
        <div class="text">文物地址</div>
        <el-input v-model="antiqueInfo.address" placeholder="请输入文物地址"></el-input>
      </div> -->
      <div class="videoInp" style="align-items: flex-start;width: 100%">
        <div class="text"><span class="require">*</span>展览图片</div>
        <el-upload v-model:file-list="antiqueInfo.pic" action="http://dfs.taoart.com/image.htm" ref="upload"
            list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :limit="1"
            :on-exceed="handleExceed">
            <el-icon>
            <Plus />
            </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="" />
        </el-dialog>
      </div>
      <!-- 单个三维模型 上传地址 http://dfs.taoart.com/image.htm?crossOrigin=http://dfs.taoart.com/crossOrigin.html&dir=alonemedia -->
            <!-- action="http://192.168.1.134:9063/file/saveFile.htm?crossOrigin=anonymous" -->
      <div class="videoInp" style="align-items: flex-start;width: 100%">
        <div class="text"><span class="require">*</span>文物文件</div>
        <el-upload class="upload-demo" style="width: 480px;"
            accept=".gltf,.glb"
            :auto-upload="true" ref="uploadVedio" :limit="1" 
            :http-request="uploadGltf"
            :on-exceed="handleExceedVedio"
            v-model:file-list="antiqueInfo.addressFile" :on-success="beforeAvatarUploadVedio"
            :on-remove="handleRemoveVedio">
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <div class="videoInp" style="align-items: flex-start;width: 100%">
        <div class="text"><span class="require">*</span>其他文件</div>
        <el-upload class="upload-demo" style="width: 480px;"
            :http-request="uploadOther"
            :auto-upload="true" ref="" :limit="6">
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <div class="videoInp" style="width: 100%">
        <div class="text">文物朝代</div>
        <div style="display: flex">
          <el-select v-model="antiqueInfo.years" placeholder="请选择标签" :teleported="false" 
               popper-class="mySelect" v-loadMore="loadTabsMore(7)">
              <el-option v-for="item in options.yearsOptions" :key="item.id" :label="item.name" :value="item.id">
                  <span  style="max-width:480px;display: inline-block;overflow-x: hidden;">{{ item.name }}</span>
                  <el-button type="text" icon="el-icon-close" @click.stop="removeTag(item.id,'yearsOptions')" style="
                      float: right;
                      color: var(--el-text-color-secondary);
                      font-size: 13px;
                  ">删除</el-button>
              </el-option>
          </el-select>
          <el-button type="primary" style="margin-left: 20px;" @click="showAdd(7)">添加标签</el-button>
        </div>
      </div>
    <div class="videoInp"  style="width: 100%"> 
        <div class="text">藏品级别</div>
        <div style="display: flex">
          <el-select v-model="antiqueInfo.level" placeholder="请选择标签" :teleported="false" 
               popper-class="mySelect" v-loadMore="loadTabsMore(8)">
              <el-option v-for="item in  options.levelOptions" :key="item.id" :label="item.name" :value="item.id">
                  <span  style="max-width:110px;display: inline-block;overflow-x: auto;">{{ item.name }}</span>
                  <el-button type="text" icon="el-icon-close" @click.stop="removeTag(item.id,'levelOptions')" style="
                      float: right;
                      color: var(--el-text-color-secondary);
                      font-size: 13px;
                  ">删除</el-button>
              </el-option>
          </el-select>
          <el-button type="primary" style="margin-left: 20px;" @click="showAdd(8)">添加标签</el-button>
        </div>
      </div>
    </div>
    <div class="videoInp">
        <div class="text">文物尺寸</div>
        <el-input v-model="antiqueInfo.size" placeholder="请输入文物尺寸"></el-input>
    </div>
    <div class="videoInp">
        <div class="text">文物简介</div>
        <el-input v-model="antiqueInfo.des" type="textarea" placeholder="请输入文物简介"></el-input>
      </div>
    <div class="videoInput" style="justify-content: flex-end;">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="submit()">确定</el-button>
    </div>
    </div>
  </template>
    
  <script setup lang="ts">
  import { ref, reactive, } from "vue";
  import { genFileId, ElMessage, ElMessageBox, } from 'element-plus'
  import type { UploadProps, UploadRawFile, UploadInstance,UploadRequestHandler } from 'element-plus'
  const { proxy } = getCurrentInstance() as any;
  interface antiqueInfo {
    id?: string;
    name: string;
    type: string;
    venueId: string;
    size: string
    number: string;
    level: any;
    years: string;
    pic: any[];
    des: string;
    ask: string;
    address: string;
    addressFile: any[];
  }
  //供应链基本信息
  let antiqueInfo = reactive<any>({
    id: "",
    name: "",
    type: "",
    des: '',
    size: '',
    venueId: '',
    years: '',
    number: '',
    ask: '',
    level: '',
    pic: [],
    address: '',
    addressFile: []
  });
  /* 场馆选择 */
  const venueOptions = ref<any[]>([]);
  const venueQuery = reactive({
    name: '',
    currentPage: 1,
    pageSize: 10,
    pageTotal:1,
  })
  const getVenueOptions = async (query: string = '')=>{
    if(query) {
      venueQuery.currentPage = 1;
      venueOptions.value = [];
    }
    const {data} = await proxy.API.getVenueList({
      pageNum:venueQuery.currentPage,
      pageSize:venueQuery.pageSize,
      name:query,
      status : '0',
      venueType:"",
    })
    venueQuery.pageTotal = data.result.pages;
    venueOptions.value?.push(...data.result.result);
    if(!venueID.value) return;
    const ids = getOptionsIds(venueOptions.value);
    if(!ids.includes(antiqueInfo.venueId)) loadVenueMore();
  }
  const loadVenueMore = ()=>{
    // 防抖处理
  setTimeout(() => {
    if(venueQuery.pageTotal === venueQuery.currentPage) return;
      venueQuery.currentPage ++;
      getVenueOptions();
    }, 500)
  }

  

  const show = ref(false);
  // let options = reactive<any>([]);
 const venueID = ref();
  const init =async (id?:number)=>{
    show.value = true;
    if(id){
       venueID.value = id??'';
        getAntique(id);
    }
    getVenueOptions();
    getTabs();
    getTabs(levelQuery,'levelOptions');
    getTabs(typeQuery,'typeOptions');
    
  }
  defineExpose({init});

  //文物朝代  & 藏品级别
  // 7=朝代8=藏品级别
  let options = reactive<any>({
    yearsOptions:[],
    levelOptions:[],
    typeOptions:[],
  });
  const yearsQuery = reactive({
    type: 7,
    pageNum: 1,
    pageSize: 10,
    pageTotal: 1,
  });
  const levelQuery = reactive({
    type: 8,
    pageNum: 1,
    pageSize: 10,
    pageTotal: 1,
  });
  const typeQuery = reactive({
    type: 9,
    pageNum: 1,
    pageSize: 10,
    pageTotal: 1,
  });
  const getTabs =async (query=yearsQuery,optionsName="yearsOptions") => {
    let params = {
      ...query,
      venueId: "",
      name: "",
    };
    const {data} =await proxy.API.getTabs(params);
    query.pageTotal = data.result.pages;
    options[optionsName].push(...data.result.result);

    if(!venueID.value) return;
    const ids:number[] = getOptionsIds(options[optionsName]);
    switch (optionsName) {
      case "yearsOptions":
        if(!ids.includes(antiqueInfo.years)) loadTabsMore(7);
        break;
      case "levelOptions":
        if(!ids.includes(antiqueInfo.years)) loadTabsMore(8);
        break;
      case "typeOptions":
        if(!ids.includes(antiqueInfo.years)) loadTabsMore(9);
        break;
      default:
        break;
    }
  };
  const loadTabsMore =(type:7|8|9) =>{
    setTimeout(() => {
      if(type === 7) {
        if(yearsQuery.pageNum === yearsQuery.pageTotal)return;
        yearsQuery.pageNum ++;
        getTabs();
      }else  if(type === 8) {
        if(levelQuery.pageNum === levelQuery.pageTotal)return;
        levelQuery.pageNum ++;
        getTabs(levelQuery,'levelOptions');
      } else if(type === 9){
        if(typeQuery.pageNum === typeQuery.pageTotal)return;
        typeQuery.pageNum ++;
        getTabs(typeQuery,'typeOptions');
      }
    }, 500)
  }
  const showAdd = (type:7|8) => {
    const names = {
      7:'文物朝代',
      8:'藏品级别',
    }
    ElMessageBox.prompt('标签名称', `新增${names[type]}`, {
      confirmButtonText: '保存',
      cancelButtonText: '取消',
    })
      .then(({ value }) => {
        postTabs(value,type);
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消新增',
        })
      })
  };
  const postTabs =async (name: string,type:7|8) => {
    let params = {
      'name': name,
      'type': type
    };
    await proxy.API.postTabs(params);
    ElMessage.success('新增成功');
    if(type === 7){
      yearsQuery.pageNum = 1;
      options.yearsOptions = [];
      getTabs();
    } else {
      levelQuery.pageNum = 1;
      options.levelOptions = [];
    await getTabs(levelQuery,'levelOptions');
    }
  }

  /* 选项id 数组 */
  const getOptionsIds = (options:any) =>{
    if(!options || !options.length) return [];
    const ids = options.map((item:any) => {
      return item.id;
    })
    return ids;
  }
  const removeTag = (id: number,name:string) => {
    ElMessageBox.confirm(
      '确定要删除吗?',
      '提示',
      {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
      }
    ).then(async() => {
      await proxy.API.delTabs({id});
      ElMessage.success('删除成功');
      options[name] = options[name].filter((item:any) =>{
        return item.id !==id;
      })
    })
  }
  
  const emit = defineEmits(['open'])
  const cancel = () => {
    show.value = false
    emit("open");
  };
  const submit = () => {
    if (antiqueInfo.id !== '') {
      postUpDateAntique();
    } else {
      postAntique();
    }
  };
  
// 图片
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const upload = ref<UploadInstance>()
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  upload.value!.clearFiles();
}
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
  upload.value!.submit();
}

// 文物
//视频超出时限制进行的处理
const uploadVedio = ref();

// 上传请求  gltf格式
const uploadGltf:UploadRequestHandler =async (params)=>{
  const paramsData = new FormData();
  paramsData.append('file',  params.file)
  const {data} = await proxy.API.saveAntiqueFile(paramsData)
  antiqueInfo.address = data.result;
}
const uploadOther:UploadRequestHandler =async (params)=>{
  const paramsData = new FormData();
  paramsData.append('file',  params.file);
  await proxy.API.saveAntiqueFile(paramsData);
}
const handleExceedVedio: UploadProps['onExceed'] = (files) => {
    
    uploadVedio.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadVedio.value!.handleStart(file);
    uploadVedio.value!.submit();
}

const beforeAvatarUploadVedio: UploadProps['onSuccess'] = (response: any) => {
  antiqueInfo.address = response.url;
}
const handleRemoveVedio: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    uploadVedio.value!.clearFiles();
    antiqueInfo.address = '';
}
  //新增
const postAntique = () => {
  let params = {
    ...antiqueInfo,
    pic: antiqueInfo.pic[0].response.url
  };
  proxy.API.postAntique(params).then((res: any) => {
    ElMessage.success('新建成功');
    cancel();
  });
};
  //获取展览交流详情
  const getAntique =async (id:number) => {
    const {data} = await proxy.API.getAntique(id);
    Object.keys(antiqueInfo).forEach((key) => {
      antiqueInfo[key] = data.result[key];
    })
    if( data.result.pic){
          antiqueInfo.pic = [{
            'url': data.result.pic
          }];
      }
   if( data.result.address){
      antiqueInfo.addressFile = [{
        'url': data.result.address,
        name:data.result.name
      }];
    }
  }
  //更新展览交流详情
  const postUpDateAntique = () => {
    let pic
    if (antiqueInfo.pic.length > 0 && antiqueInfo.pic[0].response) {
      pic = antiqueInfo.pic[0].response.url
    } else if (antiqueInfo.pic.length > 0 && antiqueInfo.pic[0].url) {
      pic = antiqueInfo.pic[0].url
    } else if (antiqueInfo.pic.length == 0) {
      pic = '';
    }
    let params = {
      ...antiqueInfo,
      pic: pic,
    };
  
    proxy.API.postUpDateAntique(params).then((res: any) => {
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
  
  .videoInp {
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