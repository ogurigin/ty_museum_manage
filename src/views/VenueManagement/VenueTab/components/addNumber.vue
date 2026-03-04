<template>
  <el-row :gutter="20" style="margin-bottom: 15px;">
    <el-col :span="8">
      <div class="trumTtem">
        <span class="text"><span class="require">*</span>数字展名称</span>
        <div class="inputBox">
          <el-input v-model="TrumInfo.name" placeholder="请输入内容"></el-input>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="trumTtem">
        <div class="text"><span class="require">*</span>数字展地址</div>
        <div class="inputBox">
          <el-input v-model="TrumInfo.address" placeholder="请输入内容"></el-input>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="trumTtem">
        <div class="text"><span class="require">*</span>展览城市</div>
        <div class="inputBox">
          <el-cascader size="large" style="width:100%" :options="ZLCity" v-model="selectedOptions" @change="handleChange"
            :append-to-body="false" :filterable="true" placeholder="请选择展览城市">
          </el-cascader>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="20" style="margin-bottom: 15px;">
    <el-col :span="8">
      <div class="trumTtem">
        <div class="text"><span class="require">*</span>展览分类</div>
        <div class="inputBox">
          <el-select v-model="TrumInfo.type" style="width:100%" placeholder="请选择分类">
            <el-option v-for="item in  ZLType" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="trumTtem">
        <div class="text"><span class="require">*</span>展览空间</div>
        <div class="inputBox">
          <el-select v-model="TrumInfo.space" style="width:100%" placeholder="请选择空间">
            <el-option v-for="item in ZLSpace" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="trumTtem">
        <div class="text">展览年份</div>
        <div class="inputBox">
          <el-date-picker v-model="TrumInfo.year" type="year" style="width:100%" placeholder="选择年份" size="large"
            class="year-picker">
          </el-date-picker>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="20" style="margin-bottom: 15px;">
    <el-col :span="8">
      <div class="trumTtem">
        <div class="text">展览常设</div>
        <div class="inputBox">
          <el-radio-group v-model="TrumInfo.model">
            <el-radio :label="1">常设展</el-radio>
            <el-radio :label="2">临时展</el-radio>
          </el-radio-group>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="trumTtem">
        <div class="text">是否VIP</div>
        <div class="inputBox">
          <el-radio-group v-model="TrumInfo.isVip">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="trumTtem">
        <div class="text">所属场馆</div>
        <div class="inputBox">
          <el-select v-model="TrumInfo.venueId" placeholder="请选择场馆名称" :teleported="false" filterable remote clearable
            v-loadMore="loadMore" :remote-method="sreachVenue">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </div>
      </div>
    </el-col>
    <el-col :span="8" style="margin-bottom: 60px;">
      <div class="trumTtem">
        <div class="text"><span class="require">*</span>数字展头图</div>
        <upload-img ref="avaUp3" class="uploadCont"></upload-img>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="20" style="margin-bottom: 60px;">
    <el-col :span="24">
      <div class="footer">
        <el-button class="btnAdd" size="large" @click="cancel">取消</el-button>
        <el-button class="btnAdd" type="primary" size="large" @click="submitForm">确定</el-button>
      </div>
    </el-col>
  </el-row>
</template>
<script setup lang='ts'>
import { ref, defineExpose, defineEmits, defineProps, toRaw, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import uploadImg from "../../../../components/upload1.vue";
import { provinceAndCityData, CodeToText, TextToCode } from 'element-china-area-data';
import moment from "moment";
const { proxy } = getCurrentInstance() as any;
const props = defineProps<{
  detailId: number
}>()
interface FORM {
  id: number,
  name: string,
  address: string,
  type: string,
  space: string,
  year: string,
  model: number,
  isVip: number,
  Hxlist: string,
  city: string,
  imglist: any,
  venueId: any
}
const TrumInfo = ref<FORM>({
  id: 0,
  name: '',
  address: '',
  type: '',
  space: '',
  year: '',
  model: 1,
  isVip: 1,
  Hxlist: '',
  city: '',
  venueId: '',
  imglist: [],
})
const options = ref<any>([]);
const ZLType = ref([
  {
    value: 1,
    label: "历史文物"
  }, {
    value: 2,
    label: "人文艺术"
  }, {
    value: 3,
    label: "自然科学"
  }, {
    value: 4,
    label: "革命历史"
  }, {
    value: 5,
    label: "文明互鉴"
  }]) as any
const ZLSpace = ref([
  {
    value: 1,
    label: "博物馆"
  }, {
    value: 2,
    label: "美术馆"
  }, {
    value: 3,
    label: "纪念馆"
  }, {
    value: 4,
    label: "图书馆"
  }
]) as any;
const avaUp3 = ref(null) as any
const selectedOptions = ref([]) as any;
const ZLCity = ref([...provinceAndCityData])
const query = reactive({
  venueType: '',
  name: '',
  currentPage: 1,
  pageSize: 10,
  pageTotal: 1,
  finished: false
});
const handleChange = (value: any) => {
  if (value[1] != null && value[2] != null) {
    var dz = CodeToText[value[0]] + '/' + CodeToText[value[1]] + '/' + CodeToText[value[2]]
  } else {
    if (value[1] != null) {
      dz = CodeToText[value[0]] + '/' + CodeToText[value[1]]
    } else {
      dz = CodeToText[value[0]]
    }
  }
  TrumInfo.value.city = dz
}
const returnInfo = (val: any) => {
  const info = toRaw(val)

  TrumInfo.value.id = info.id
  TrumInfo.value.name = info.name
  TrumInfo.value.address = info.address
  TrumInfo.value.type = info.type
  TrumInfo.value.space = info.space
  TrumInfo.value.year = info.year.toString()
  TrumInfo.value.model = info.model
  TrumInfo.value.isVip = info.isVip
  TrumInfo.value.city = info.city
  TrumInfo.value.venueId = info.venueId
  console.log();

  if (info.city) {
    let arr = info.city.split('/')
    if (arr[0] == '天津市' || arr[0] == '北京市' || arr[0] == '重庆市' || arr[0] == '上海市') {
      arr[1] = '市辖区'
    }
    let city = TextToCodeNum(arr)
    selectedOptions.value = city
  }
  nextTick(() => {
    avaUp3.value.returnImg(info.pics)
  })
}
const postTrumDigInfo = async () => {
  if (!TrumInfo.value.name) {
    ElMessage.warning('请输入数字展名称!')
    return
  }
  if (!TrumInfo.value.address) {
    ElMessage.warning('请输入数字展地址!')
    return
  }
  if (!TrumInfo.value.city) {
    ElMessage.warning('请选择展览城市!')
    return
  }
  if (!TrumInfo.value.type) {
    ElMessage.warning('请选择展览分类!')
    return
  }
  if (!TrumInfo.value.space) {
    ElMessage.warning('请选择展览空间!')
    return
  }
  await Promise.all([
    avaUp3.value.uploadImg()
  ]).then((res: any) => {
    if (res != 'err') {
      TrumInfo.value.imglist = res.toString()
    } else {
      ElMessage.warning('请上传数字展头图！')
    }
  })
  TrumInfo.value.year = moment(TrumInfo.value.year).format('yyyy')
  proxy.API.postTrumDigInfo({
    name: TrumInfo.value.name,
    address: TrumInfo.value.address,
    type: TrumInfo.value.type,
    space: TrumInfo.value.space,
    year: TrumInfo.value.year,
    Hxlist: TrumInfo.value.Hxlist,
    city: TrumInfo.value.city,
    model: TrumInfo.value.model,
    isVip: TrumInfo.value.isVip,
    pics: TrumInfo.value.imglist,
    venueId: TrumInfo.value.venueId,
    status: 1,
  }).then((res: any) => {
    if (res.data.success) {
      ElMessage.success('添加成功')
      emit('updated', 'third')
    }
  })
}
const UpDateTrumDigInfo = async () => {
  if (!TrumInfo.value.name) {
    ElMessage.warning('请输入数字展名称!')
    return
  }
  if (!TrumInfo.value.address) {
    ElMessage.warning('请输入数字展地址!')
    return
  }
  if (!TrumInfo.value.city) {
    ElMessage.warning('请选择展览城市!')
    return
  }
  if (!TrumInfo.value.type) {
    ElMessage.warning('请选择展览分类!')
    return
  }
  if (!TrumInfo.value.space) {
    ElMessage.warning('请选择展览空间!')
    return
  }
  await Promise.all([
    avaUp3.value.uploadImg()
  ]).then((res: any) => {
    if (res != 'err') {
      TrumInfo.value.imglist = res.toString()
    } else {
      ElMessage.warning('请上传数字展头图！')
    }
  })
  TrumInfo.value.year = moment(TrumInfo.value.year).format('yyyy')
  proxy.API.UpDateTrumDigInfo({
    id: TrumInfo.value.id,
    name: TrumInfo.value.name,
    address: TrumInfo.value.address,
    type: TrumInfo.value.type,
    space: TrumInfo.value.space,
    year: TrumInfo.value.year,
    Hxlist: TrumInfo.value.Hxlist,
    city: TrumInfo.value.city,
    model: TrumInfo.value.model,
    isVip: TrumInfo.value.isVip,
    pics: TrumInfo.value.imglist,
    venueId: TrumInfo.value.venueId,
    status: 1,
  }).then((res: any) => {
    if (res.data.success) {
      ElMessage.success('修改成功')
      emit('updated', 'third')
    }
  })
}
const TextToCodeNum = (value: any) => {
  let city = [TextToCode[value[0]].code, TextToCode[value[0]][value[1]].code]
  return city
}

//所属场馆筛选功能
const sreachVenue = (e: string) => {
  if (e) {
    query.name = e;
  } else {
    query.name = ''
  }
  query.currentPage = 1;
  proxy.API.getVenueList({
    pageNum: query.currentPage,
    pageSize: query.pageSize,
    name: query.name || '',
    status: '0',
    venueType: query.venueType || ''
  }).then((res: any) => {
    query.pageTotal = res.data.result.pages
    query.currentPage = res.data.result.page
    if (res.data.result.result.length >= 0) {
      options.value = res.data.result.result
    }
  });
};
//所属场馆加载更多
const sreachVenueTwo = () => {
  proxy.API.getVenueList({
    pageNum: query.currentPage,
    pageSize: query.pageSize,
    name: query.name || '',
    status: '0',
    venueType: query.venueType || ''
  }).then((res: any) => {
    if (res.data.result.result.length >= 0) {
      if (query.currentPage <= query.pageTotal) {
        query.pageTotal = res.data.result.pages
        query.currentPage = res.data.result.page
        options.value = [...options.value, ...res.data.result.result];
        if (TrumInfo.value.venueId) {
          const filteredOptions = options.value.filter((option: any) => option.id == TrumInfo.value.venueId);
          if (filteredOptions.length == 0) {
            query.currentPage = query.currentPage + 1
            sreachVenueTwo();
          }
        }
      }
    }
  });
}
const loadMore = () => {
  // 防抖处理
  setTimeout(() => {
    if (query.currentPage >= query.pageTotal || query.finished) {
      return
    } else {
      query.currentPage += 1
      sreachVenueTwo()
    }
  }, 500)
}
const emit = defineEmits<{
  (event: 'closeDoor', val: string): void
  (event: 'updated', val: string): void
}>()
const cancel = () => {
  emit('closeDoor', 'third')
}
const submitForm = () => {
  if (TrumInfo.value.id && TrumInfo.value.id != 0) {
    UpDateTrumDigInfo()
  } else {
    postTrumDigInfo()
  }

}
onMounted(() => {
  window.addEventListener('popstate', function () {
    emit('closeDoor', 'third')
  }, true);
  sreachVenueTwo();
})
defineExpose({
  returnInfo
})
</script>
<style lang='less' scoped>
.footer {
  padding: 0 150px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
}

.trumTtem {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 480px;
  position: relative;

  .text {
    min-width: 100px;
    text-align: end;
    margin-right: 16px;

    .require {
      display: inline-block;
      margin-right: 4px;
      height: 16px;
      line-height: 16px;
      color: red;
    }
  }

  .inputBox {
    width: 380px;
  }

  .btnAdd {
    position: absolute;
    right: -15px;
    top: 0;
  }
}

.felxT {
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