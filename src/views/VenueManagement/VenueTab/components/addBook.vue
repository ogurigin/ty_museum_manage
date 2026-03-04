<template>
    <el-row :gutter="20" style="margin-bottom: 15px;">
        <el-col :span="7">
            <div class="trumTtem">
              <div class="text"><span class="require">*</span>书籍名称</div>
              <div class="inputBox">
                <el-input v-model="TrumBookInfo.name" placeholder="请输入书籍名称"></el-input>
              </div>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="trumTtem">
              <div class="text"><span class="require">*</span>定价</div>
              <div class="inputBox">
                <el-input v-model="TrumBookInfo.price" placeholder="请输入定价"></el-input>
              </div>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="trumTtem">
              <div class="text"><span class="require">*</span>作者</div>
              <div class="inputBox">
                <el-input v-model="TrumBookInfo.auther" placeholder="请输入作者"></el-input>
              </div>
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 15px;">
        <el-col :span="7">
            <div class="trumTtem">
              <div class="text">出版日期</div>
              <div class="inputBox">
                <el-input v-model="TrumBookInfo.publishDate" placeholder="请输入出版日期"></el-input>
              </div>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="trumTtem">
              <div class="text">出版社</div>
              <div class="inputBox">
                <el-input v-model="TrumBookInfo.press" placeholder="请输入出版社"></el-input>
              </div>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="trumTtem">
                <div class="text">总页数</div>
                <div class="inputBox">
                  <el-input v-model="TrumBookInfo.bookTotal" placeholder="请输入总页数"></el-input>
                </div>
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 15px;">
        <el-col :span="7">
            <div class="trumTtem">
              <div class="text">淘宝地址</div>
              <div class="inputBox">
                <el-input v-model="TrumBookInfo.tbLink" placeholder="请输入淘宝地址"></el-input>
              </div>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="trumTtem">
              <div class="text">京东地址</div>
              <div class="inputBox">
                <el-input v-model="TrumBookInfo.jdLink" placeholder="请输入京东地址"></el-input>
              </div>
            </div>
        </el-col>
        <el-col :span="7">
                <div class="trumTtem">
                  <div class="text">分类</div>
                  <div class="inputBox">
                    <el-select v-model="TrumBookInfo.type" style="width:100%" placeholder="请选择分类" :teleported="false" v-loadMore="loadMore">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <el-button  class="btnAdd" type="primary" :icon="Plus" @click="handleAdd">添加分类</el-button>
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 15px;">
        <el-col :span="14">
            <div class="trumTtem felxT" style="width: 100%;">
                <div class="text">内容简介</div>
                <el-input type="textarea" :rows="12" placeholder="请输入内容" v-model="TrumBookInfo.des"></el-input>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="trumTtem felxT">
              <div class="text"><span class="require">*</span>书籍轮播图</div>
              <upload-img ref="avaUp5"></upload-img>
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
import {ref,defineEmits,defineProps,onMounted,toRaw,defineExpose} from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import uploadImg from "../../../../components/upload1.vue";
import moment from "moment";
const {proxy} = getCurrentInstance() as any;
const props = defineProps<{
  detailId:number
}>()
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
interface FORM {
    id:number,
    name:string,
    price:string,
    auther:string,
    publishDate:string,
    press:string,
    bookTotal:string,
    tbLink:string,
    jdLink:string,
    type:string,
    des:string,
    imglist:string,
}
const TrumBookInfo = ref<FORM>({
  id:0,
    name:'',
    price:'',
    auther:'',
    publishDate:'',
    press:'',
    bookTotal:'',
    tbLink:'',
    jdLink:'',
    type:'',
    des:'',
    imglist:'',
});
const query = reactive<any>({
    pageNum:1,
    pageTotal:1,
    finished:false,
})
const typeName = ref() as any;
const editVisible = ref(false)
const avaUp5 = ref(null) as any
const handleAdd = () => {
    editVisible.value = true
}
const saveEdit = () => {
  if(!typeName.value){
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
const returnInfo = (val:any) => {
        const info = toRaw(val)
        TrumBookInfo.value.id = info.id
        TrumBookInfo.value.name = info.name
        TrumBookInfo.value.auther = info.auther
        TrumBookInfo.value.publishDate =info.publishDate?moment(info.publishDate).format('YYYY-MM-DD'):''
        TrumBookInfo.value.press = info.press
        TrumBookInfo.value.bookTotal = info.bookTotal
        TrumBookInfo.value.price= info.price
        TrumBookInfo.value.tbLink= info.tbLink
        TrumBookInfo.value.jdLink= info.jdLink
        TrumBookInfo.value.type= info.type
        TrumBookInfo.value.price= info.price
        TrumBookInfo.value.des= info.des
        nextTick(() => {
          avaUp5.value.returnImg(info.pics)
        })
}
const postTrumBookInfo = async() => {
  if(!TrumBookInfo.value.name){
    ElMessage.warning('请输入书籍名称!')
    return
  }
  if(!TrumBookInfo.value.price){
    ElMessage.warning('请输入定价!')
    return
  }
  if(!TrumBookInfo.value.auther){
    ElMessage.warning('请输入作者!')
    return
  }
  await Promise.all([
    avaUp5.value.uploadImg()
	]).then((res:any) => {
    if(res != 'err'){
      TrumBookInfo.value.imglist = res.toString()
    }else{
      ElMessage.warning('请上传书籍轮播图！')
    }
		
	})
  proxy.API.postTrumBookInfo({
        name:TrumBookInfo.value.name,
        price:TrumBookInfo.value.price,
        auther:TrumBookInfo.value.auther,
        publishDate:TrumBookInfo.value.publishDate,
        press:TrumBookInfo.value.press,
        bookTotal:TrumBookInfo.value.bookTotal,
        tbLink:TrumBookInfo.value.tbLink,
        jdLink:TrumBookInfo.value.jdLink,
        type:TrumBookInfo.value.type,
        des:TrumBookInfo.value.des,
        pics: TrumBookInfo.value.imglist,
        venueId: props.detailId,
        status: 1,
  }).then((res:any) => {
    if(res.data.success){
      ElMessage.success('添加成功')
      emit('updated','five')
    }
  })
}
const UpdateTrumBookInfo = async() => {
  if(!TrumBookInfo.value.name){
    ElMessage.warning('请输入书籍名称!')
    return
  }
  if(!TrumBookInfo.value.price){
    ElMessage.warning('请输入定价!')
    return
  }
  if(!TrumBookInfo.value.auther){
    ElMessage.warning('请输入作者!')
    return
  }
  await Promise.all([
    avaUp5.value.uploadImg()
	]).then((res:any) => {
    if(res != 'err'){
      TrumBookInfo.value.imglist = res.toString()
    }else{
      ElMessage.warning('请上传书籍轮播图！')
    }
		
	})
  proxy.API.UpdateTrumBookInfo({
        id:TrumBookInfo.value.id,
        name:TrumBookInfo.value.name,
        price:TrumBookInfo.value.price,
        auther:TrumBookInfo.value.auther,
        publishDate:TrumBookInfo.value.publishDate,
        press:TrumBookInfo.value.press,
        bookTotal:TrumBookInfo.value.bookTotal,
        tbLink:TrumBookInfo.value.tbLink,
        jdLink:TrumBookInfo.value.jdLink,
        type:TrumBookInfo.value.type,
        des:TrumBookInfo.value.des,
        pics: TrumBookInfo.value.imglist,
        venueId: props.detailId,
        status: 1,
  }).then((res:any) => {
    if(res.data.success){
      ElMessage.success('修改成功')
      emit('updated','five')
    }
  })
}
const postTabs = () => {
  if(!typeName.value){
    ElMessage.warning('请输入类型名称!')
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
    emit('closeDoor','five')
}
const submitForm = () => {
  if(TrumBookInfo.value.id && TrumBookInfo.value.id != 0){
    UpdateTrumBookInfo()
  }else{
    postTrumBookInfo()
  }  
}
onMounted(()=> {
    query.pageNum = 1
    query.finished = false
    typeName.value = null
    getTabs()
    window.addEventListener('popstate', function () {
      emit('closeDoor','five')
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