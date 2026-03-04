<template>
    <el-row :gutter="20" style="margin-bottom: 15px;">
        <el-col :span="7">
            <div class="trumTtem">
              <div class="text"><span class="require">*</span>附件名称</div>
              <div class="inputBox"> 
                <el-input v-model="TrumInfo.name" placeholder="请输入商品名称"></el-input>
              </div>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="trumTtem felxT">
              <div class="text"><span class="require">*</span>附件封面</div>
              <upload-img ref="avaUp4" class="uploadCont"></upload-img>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="trumTtem felxT">
              <div class="text"><span class="require">*</span>附件文件</div>
             <upload-file></upload-file>
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 60px;">
        <el-col :span="24">
          <div class="footer">
              <el-button  class="btnAdd" size="large" @click="cancel">取消</el-button>
              <el-button  class="btnAdd" type="primary" size="large" @click="submitForm">确定</el-button>
          </div>
        </el-col>
    </el-row>
    <div class="myDialogClass">
      <el-dialog title="添加商品分类" v-model="editVisible" width="25%">
        <el-form label-width="70px">
          <el-form-item label="分类名称">
            <el-input v-model="typeName"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
</template>
<script setup lang='ts'>
import {ref,defineProps,defineEmits,onMounted,toRaw,defineExpose} from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import uploadImg from "../../../../components/upload1.vue";
import uploadFile from "../../../../components/uploadFile.vue";
const {proxy} = getCurrentInstance() as any;
const props = defineProps<{
    detailId:number
}>()
interface FORM {
    id:number,
    name:string,
    price:string,
    type:string,
    material:string,
    tbLink:string,
    jdLink:string,
    des:string,
    Hxlist: any,
}
const options = ref([
        {
          value: 1,
          label: "帆布袋"
        }, {
          value: 2,
          label: "水杯"
        }, {
          value: 3,
          label: "文化衫"
        }, {
          value: 4,
          label: "纪念品"
        }, {
          value: 5,
          label: "文具"
        }
]) as any;
const TrumInfo = ref<FORM>({
    id:0,
    name:'',
    price:'',
    type:'',
    material:'',
    tbLink:'',
    jdLink:'',
    des:'',
    Hxlist:[]
})
const query = reactive<any>({
    pageNum:1,
    pageTotal:1,
    finished:false,
})
const typeName = ref('') as any
const editVisible = ref(false)
const avaUp4 = ref(null) as any
const postTrumGoodsInfo = async() => {
    if(!TrumInfo.value.name){
        ElMessage.warning('请输入商品名称!')
        return
    }
    if(!TrumInfo.value.price){
        ElMessage.warning('请输入定价!')
        return
    }
    await Promise.all([
      avaUp4.value.uploadImg()
    ]).then((res:any) => {
      if(res != 'err'){
        TrumInfo.value.Hxlist= res.toString()
      }else{
        ElMessage.warning('请上传商品轮播图！') 
      }
      
    })
    proxy.API.postTrumGoodsInfo({
        name:TrumInfo.value.name,
        price:TrumInfo.value.price,
        type:TrumInfo.value.type,
        material:TrumInfo.value.material,
        tbLink:TrumInfo.value.tbLink,
        jdLink:TrumInfo.value.jdLink,
        des:TrumInfo.value.des,
        pics:TrumInfo.value.Hxlist,
        venueId:props.detailId
    }).then((res:any) => {
        if(res.data.success){
            ElMessage.success('添加成功')
            emit('updated','fourth')
        }
    })
}
const UpdateTrumGoodsInfo = async()=>{
  if(!TrumInfo.value.name){
        ElMessage.warning('请输入商品名称!')
        return
    }
    if(!TrumInfo.value.price){
        ElMessage.warning('请输入定价!')
        return
    }
    await Promise.all([
      avaUp4.value.uploadImg()
    ]).then((res:any) => {
      if(res != 'err'){
        TrumInfo.value.Hxlist= res.toString()
      }else{
        ElMessage.warning('请上传商品轮播图！') 
      }
      
    })
    proxy.API.UpdateTrumGoodsInfo({
        id:TrumInfo.value.id,
        name:TrumInfo.value.name,
        price:TrumInfo.value.price,
        type:TrumInfo.value.type,
        material:TrumInfo.value.material,
        tbLink:TrumInfo.value.tbLink,
        jdLink:TrumInfo.value.jdLink,
        des:TrumInfo.value.des,
        pics:TrumInfo.value.Hxlist,
        venueId:props.detailId
    }).then((res:any) => {
        if(res.data.success){
            ElMessage.success('修改成功')
            emit('updated','fourth')
        }
    })
}
const returnInfo = (val:any) => {
        const info = toRaw(val)
        console.log(toRaw(val),'ssssss')
        TrumInfo.value.id = info.id
        TrumInfo.value.name = info.name
        TrumInfo.value.material= info.material
        TrumInfo.value.tbLink= info.tbLink
        TrumInfo.value.jdLink= info.jdLink
        TrumInfo.value.type= info.type
        TrumInfo.value.price= info.price
        TrumInfo.value.des= info.des
        nextTick(() => {
          avaUp4.value.returnImg(info.pics)
        })
}
const handleAdd = () => {
    editVisible.value = true
}
const saveEdit = () => {
    if(!typeName.value){
        ElMessage.warning('请输入类型名称!')
        editVisible.value = false
        return 
    }
    postTabs()
}
const getTabs = () => {
  proxy.API.getTabs({
        pageNum: query.pageNum,
        venueId: "",
        type: 5
  }).then((res:any) => {
    if(res.data.success){
      if(res.data.result.result.length>0){
            query.pageTotal = res.data.result.pages
            query.pageNum = res.data.result.page
            if(query.pageNum > query.pageTotal){
              query.finished = true
            }else{
                const newArray = res.data.result.result.map((item:any) => {
                    return {
                        value: item.id,
                        label: item.name
                    }
                    })
                    options.value = [...options.value,...newArray]
            }
            
           }else{
            query.finished = true
           }
      }else{
        query.finished = true
      }
  }).catch((res:any)=>{
      query.finished = true
      console.log(res)
  })
}
const loadMore = () => {
    console.log('触底了')
    // 防抖处理
    setTimeout(() => {
        if (query.pageNum >= query.pageTotal || query.finished){
           return
        }else{
            query.pageNum += 1
            getTabs()
        }
    }, 500)
}
const postTabs = () => {
  if(!typeName.value){
    editVisible.value = false
    return 
  }
  proxy.API.postTabs({
      name: typeName.value,
      type: 5
  }).then((res:any) => {
    if(res.data.success){
        editVisible.value = false
        getTabs()
    }
  })
}
const emit = defineEmits<{
    (event:'closeDoor',val:string):void
    (event:'updated',val:string):void
}>()
const cancel = () => {
    emit('closeDoor','fourth')
}
const submitForm = () => {
  if(TrumInfo.value.id && TrumInfo.value.id != 0){
    UpdateTrumGoodsInfo()
  }else{
    postTrumGoodsInfo()
  }
    
}
onMounted(()=> {
    query.pageNum = 1
    query.finished = false
    typeName.value = null
    getTabs()
    window.addEventListener('popstate', function () {
      emit('closeDoor','fourth')
    }, true)
})
defineExpose({
  returnInfo
})
</script>
<style lang='less' scoped>

.myDialogClass{
    :deep .el-dialog {
        border-radius: 10px; 
        .el-dialog__header {
            border-bottom: 1px solid #eee;
        }
    }
    
}
.footer{
    padding: 0 150px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    overflow: hidden;
    box-sizing: border-box;
}
.trumTtem{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 480px;
    position: relative;
    .text{
        min-width: 100px;
        text-align: end;
        margin-right: 16px;
        .require{
            display: inline-block;
            margin-right: 4px;
            height: 16px;
            line-height: 16px;
            color:red;
        }
    }
    .inputBox{
      width: 380px;
    }
    .btnAdd{
        position: absolute;
        right: -125px;
        top:0;
    }
}
.felxT{
    align-items: start; 
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
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